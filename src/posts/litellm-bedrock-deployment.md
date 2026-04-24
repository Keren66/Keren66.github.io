---
title: 在 AWS EC2 上部署 LiteLLM 代理 Bedrock Claude 模型完整指南
date: 2026-04-24
excerpt: 本教程将指导您在 AWS EC2 上部署 LiteLLM 代理服务器，以统一的 OpenAI 兼容 API 格式调用 AWS Bedrock 上的 Claude 模型。
---

# 在 AWS EC2 上部署 LiteLLM 代理 Bedrock Claude 模型完整指南

本教程将指导您在 AWS EC2（Amazon Linux 2023，t3.medium 实例）上部署 LiteLLM 代理服务器，以统一的 OpenAI 兼容 API 格式调用 AWS Bedrock 上的 Claude 模型。通过这种方式，您可以轻松地将现有的基于 OpenAI API 的应用迁移到 Claude 模型，同时利用 LiteLLM 提供的成本追踪、负载均衡和虚拟密钥管理等企业级功能 [1]。

## 1. 准备工作

在开始部署之前，请确保您已准备好以下资源：

1. **AWS 账号**：已开通 Bedrock 上的 Claude 模型访问权限。
2. **AKSK 凭证**：拥有调用 Bedrock 权限的 IAM 用户的 Access Key ID 和 Secret Access Key。
3. **EC2 实例**：
   - **操作系统**：Amazon Linux 2023
   - **实例类型**：t3.medium（LiteLLM 官方建议生产环境至少 4 vCPU 和 8 GB RAM，t3.medium 提供 2 vCPU 和 4 GB RAM，适合中小型企业内部开发团队使用）[2]。
   - **安全组**：允许入站 SSH（端口 22）和 LiteLLM 代理服务端口（默认 4000）的流量。

## 2. 环境配置

首先，通过 SSH 连接到您的 EC2 实例，并更新系统软件包。

```bash
sudo dnf update -y
```

### 2.1 安装 Python 和 pip

Amazon Linux 2023 默认预装了 Python 3.9，但可能需要手动安装 pip [3]。

```bash
sudo dnf install python3-pip -y
```

### 2.2 安装 Docker 和 Docker Compose（强烈推荐部署方式）

使用 Docker 部署 LiteLLM 是最推荐的方式，它能确保环境的一致性并简化依赖管理 [4]。

```bash
# 安装 Docker
sudo dnf install docker -y

# 启动 Docker 服务并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker

# 将当前用户（ec2-user）添加到 docker 组，以便免 sudo 运行 docker 命令
sudo usermod -aG docker ec2-user

# 安装 Docker Compose 插件
sudo dnf install docker-compose-plugin -y
```

> **注意**：执行完 `usermod` 命令后，您需要退出当前 SSH 会话并重新连接，以使组权限生效。

## 3. 配置 LiteLLM

LiteLLM 通过 `config.yaml` 文件进行配置。我们将创建一个工作目录来存放配置文件。

```bash
mkdir -p ~/litellm-proxy
cd ~/litellm-proxy
```

### 3.1 创建配置文件

使用您喜欢的文本编辑器（如 `nano` 或 `vim`）创建 `config.yaml` 文件。

```bash
nano config.yaml
```

将以下内容粘贴到文件中，并根据您的实际情况进行修改：

```yaml
model_list:
  - model_name: claude-3-sonnet # 这是您对外暴露的模型别名
    litellm_params:
      model: bedrock/anthropic.claude-3-sonnet-20240229-v1:0 # Bedrock 上的实际模型 ID
      aws_access_key_id: os.environ/AWS_ACCESS_KEY_ID
      aws_secret_access_key: os.environ/AWS_SECRET_ACCESS_KEY
      aws_region_name: os.environ/AWS_REGION_NAME

  - model_name: claude-3-haiku
    litellm_params:
      model: bedrock/anthropic.claude-3-haiku-20240307-v1:0
      aws_access_key_id: os.environ/AWS_ACCESS_KEY_ID
      aws_secret_access_key: os.environ/AWS_SECRET_ACCESS_KEY
      aws_region_name: os.environ/AWS_REGION_NAME

general_settings:
  master_key: sk-your-secure-master-key-here # 替换为您自定义的强密码，必须以 sk- 开头
```

> **安全提示**：`master_key` 是您的代理服务器管理员密钥，用于生成其他访问密钥或访问管理面板。请务必将其设置为一个复杂且安全的字符串，并妥善保管 [5]。

### 3.2 创建环境变量文件

为了安全地传递 AWS 凭证，我们将创建一个 `.env` 文件。

```bash
nano .env
```

填入您的 AWS AKSK 信息和区域：

```env
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION_NAME=us-east-1 # 替换为您开通 Bedrock 模型的实际区域，如 us-west-2
```

## 4. 启动 LiteLLM 代理服务

我们将使用 Docker 运行 LiteLLM 代理服务器，并将配置文件和环境变量挂载到容器中。

```bash
docker run -d \
  --name litellm-proxy \
  --restart always \
  -p 4000:4000 \
  -v $(pwd)/config.yaml:/app/config.yaml \
  --env-file .env \
  docker.litellm.ai/berriai/litellm:main-latest \
  --config /app/config.yaml --detailed_debug
```

### 4.1 验证服务状态

检查 Docker 容器是否正常运行：

```bash
docker ps
```

查看 LiteLLM 日志以确认没有启动错误：

```bash
docker logs -f litellm-proxy
```

如果看到类似 `INFO: Proxy running on http://0.0.0.0:4000` 的输出，说明服务已成功启动 [6]。

## 5. 测试 API 调用

现在，您的 LiteLLM 代理服务器已经在端口 4000 上运行，并提供了与 OpenAI 完全兼容的 API 接口。

您可以使用 `curl` 命令从本地或外部（如果安全组已开放 4000 端口）测试调用：

```bash
curl --location 'http://localhost:4000/chat/completions' \
--header 'Authorization: Bearer sk-your-secure-master-key-here' \
--header 'Content-Type: application/json' \
--data '{
    "model": "claude-3-sonnet",
    "messages": [
        {
            "role": "user",
            "content": "你好，请介绍一下你自己。"
        }
    ]
}'
```

> **注意**：在 `Authorization` 请求头中，请使用您在 `config.yaml` 中设置的 `master_key`。localhost:4000也可以替换为您的ip地址。

## 6. 生产环境建议

对于生产环境部署，建议考虑以下最佳实践 [2]：

| 实践项 | 说明 |
| :--- | :--- |
| **配置 HTTPS** | 使用 Nginx 或 Application Load Balancer (ALB) 作为反向代理，为您的 LiteLLM 服务配置 SSL/TLS 证书，确保数据传输安全。 |
| **使用虚拟密钥** | 不要直接在应用程序中使用 `master_key`。通过 LiteLLM 的 `/key/generate` 接口为不同的应用或用户生成独立的虚拟密钥（Virtual Keys），以便进行细粒度的成本追踪和速率限制。 |
| **配置数据库** | 如果需要持久化存储虚拟密钥、预算和使用日志，建议配置 PostgreSQL 数据库并连接到 LiteLLM。 |
| **资源监控** | 监控 EC2 实例的 CPU 和内存使用情况。如果并发请求量较大，t3.medium 的 4GB 内存可能会成为瓶颈，建议升级到 t3.large 或更高配置。 |

## 参考文献

[1] LiteLLM 官方文档 - CLI 快速启动: https://docs.litellm.ai/docs/proxy/quick_start
[2] LiteLLM 官方文档 - 生产环境最佳实践: https://docs.litellm.ai/docs/proxy/prod
[3] Amazon Linux 2023 官方文档 - Python: https://docs.aws.amazon.com/linux/al2023/ug/python.html
[4] LiteLLM 官方文档 - Docker 部署: https://docs.litellm.ai/docs/proxy/deploy
[5] LiteLLM 官方文档 - 虚拟密钥: https://docs.litellm.ai/docs/proxy/virtual_keys
[6] LiteLLM 官方文档 - AWS Bedrock 配置: https://docs.litellm.ai/docs/providers/bedrock
