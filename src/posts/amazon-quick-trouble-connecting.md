---
title: 桌面客户端卡在 "Trouble connecting. Retrying." —— 一次 refresh token 轮换失败的排障
date: 2026-11-03
excerpt: 升级后应用无限卡在 Retrying，重启无效。顺着 refresh_failing_since 一路查下去，根因是 OAuth 刷新令牌轮换做了一半，加上 IdP 没有按 RFC 6749 返回 invalid_grant，客户端把永久性错误当成临时故障重试了 4192 次。
---

# 桌面客户端卡在 "Trouble connecting. Retrying." —— 一次 refresh token 轮换失败的排障

> 说明：文中账号、IdP 域名等内部标识已脱敏为占位符，技术细节保持原样。

**日期**：2026-11-03 　**客户端版本**：1.1.4185 　**账号**：`user@example.com` 　**IdP**：`https://login.idp.example.com`（client_id = `amazon-quick-desktop`）

---

## 1. 现象

- 桌面端升级后启动，界面一直停在 **"Trouble connecting. Retrying."**，重启应用、重装都没用。
- 窗口本身正常创建（主进程日志里有 `ready-to-show`），说明不是启动崩溃，而是认证链路卡住：token 请求稳定返回 **400**，后续业务 API 随之 **401**。

![图1：启动后界面一直卡在 "Trouble connecting. Retrying."](/blog-assets/amazon-quick-trouble-connecting/fig1.jpg)

*图1：启动后界面一直停在 "Trouble connecting. Retrying."，右下角是"导出日志"按钮——这次排障的入口*

## 2. 证据链

关键在于别只看应用日志，把四路证据对齐到同一时刻：

| 来源 | 内容 |
|---|---|
| `~/.quickwork/profiles.json` | `"refresh_failing_since": 1793657222` → **2026-11-03 06:07:02（UTC+8）** |
| 应用日志 | `returned 400: code=unknown` |
| 直接请求 IdP token 端点 | 用本地存的 refresh token 去换，返回 **HTTP 400** `{"detail":"refresh token not found"}` |
| IdP 控制台 Login Logs | `token_refresh / refresh_token / Failed / refresh token invalid`，第一条 **2026-11-02T22:07:02Z**，与上面的 06:07:02（UTC+8）是同一时刻；**累计 4192 条失败** |

四路证据互相印证：**本地存的 refresh token 在服务端已经不存在了**，而客户端把这件事记在了 `refresh_failing_since` 里，时间点精确到秒。

## 3. 根因

两个问题叠加，缺一不会这么严重。

**① 刷新令牌轮换（rotation）只完成了一半。**
那次刷新请求在途中被 `ECONNRESET` / 超时打断：IdP 侧已经把旧的 RT 作废、并签发了新 RT，但新 RT 的响应没能送达客户端。于是本地保存的永远是那个已失效的 RT——**重启当然没用，因为每次重启都拿同一个"死 RT"去换**。

**② 错误语义缺失，导致客户端把永久性故障当成临时故障。**
OAuth 2.0（RFC 6749 §5.2）规定 token 端点出错要返回 `{"error":"invalid_grant","error_description":"..."}`。这里的 IdP 只返回了 `{"detail":"refresh token not found"}`，没有标准 `error` 字段。客户端认不出这个错误（落到 `code=unknown` 分支），于是走"网络抖动，等会儿再试"的逻辑——一路重试 4192 次，永远等不到"请重新登录"的引导。

## 4. 已排除项

- **不是崩溃**：DiagnosticReports 里没有该应用的崩溃记录，`diagnostics.json` 的 `crash_summary` 为空。
- **不是网络**：DNS 正常、TLS 正常、`https://login.idp.example.com/` 返回 200、没有系统代理或 VPN。
- **不是时钟偏差**：本机时间与 IdP 响应头时间一致（时钟偏差是 JWT 校验失败的高频原因，值得单独排）。
- **不是版本**：1.1.4185 已是最新，自动更新检查通过。

## 5. 解决办法（已验证有效）

思路很简单：把本地那份失效的会话状态清掉，让客户端没有"可复用的旧 RT"，就会强制走一次完整的 SSO 登录。

1. **彻底退出应用**，包括托盘/后台进程（macOS 用 `Cmd+Q` 或 `pkill`，Windows 检查任务管理器）。
2. **先备份**：

   ```bash
   cp ~/.quickwork/profiles.json ~/.quickwork/profiles.json.bak
   ```

3. 把 `~/.quickwork/profiles.json` 改成空会话：

   ```json
   {
     "version": 1,
     "entries": [],
     "last_active": null
   }
   ```

4. 重新启动。此时没有用户状态，会强制重新走 SSO 登录，登录后一切恢复正常。

> Windows 下路径是 `%USERPROFILE%\.quickwork\profiles.json`。
> 注意：清空 `entries` 会清掉**所有**本地登录信息，多账号环境需要逐个重新登录。

## 6. 后续建议

**IdP 侧**

- token 端点出错时按 RFC 6749 返回 `{"error":"invalid_grant", ...}`，客户端才有机会区分"需要重新登录"和"稍后重试"。
- 给 RT 轮换加**宽限期**：旧 RT 作废后短时间内仍可使用一次；或者同一个旧 RT 重复请求时幂等地返回同一个新 RT。这样网络中断丢了响应，会话也不会直接废掉。
- 对同一个 client 的连续刷新失败做告警/限流——这次 4192 条失败在控制台躺了好几个小时，没人发现。

**客户端侧**

- 刷新返回 4xx 时不要无限重试。连续失败 N 次后进入"请重新登录"状态，并给出重新登录按钮，而不是把用户按在 Retrying 界面上。
- 错误解析不要依赖非标准字段：`detail` 是自家约定的，换个 IdP 就失配。

## 7. 可复用的排查顺序

下次遇到同类"认证卡死"的客户端问题，按这个顺序走，通常 10 分钟内能定位：

1. 应用日志里找**具体状态码**（400/401/403 的语义完全不同）。
2. 找客户端的**持久化会话文件**，看有没有 `*_failing_since`、`last_error` 这类时间戳字段——它往往直接给出了故障起点。
3. 用**本地存的 token 手工打一次 token 端点**，看服务端怎么说（这一步能立刻区分"客户端逻辑问题"和"服务端状态问题"）。
4. 到 IdP 的登录日志里按 **client_id + 时间**筛，看失败是否连续、从哪一刻开始。
5. 最后才怀疑网络、时钟、版本——这三者排除成本低，但误判成本高。
