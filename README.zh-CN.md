# subscription-integration

[English README](./README.md)

这是一个基于 Cloudflare Workers 的订阅聚合服务，用来整合：

- 一个上游开源规则集
- 存储在 Cloudflare D1 中的个人节点
- 存储在 Cloudflare D1 中的第三方机场订阅源
- 存储在 Cloudflare D1 中的个人规则集

项目当前优先面向兼容 Mihomo 的客户端：

- OpenClash
- Clash Mi
- Clash Verge Rev
- Stash

同时也保留原始 URI 输出，方便仍然依赖 URI 列表或 base64 节点订阅的客户端使用。

## 功能概览

- 在 `/admin` 提供管理后台
- 将个人节点以 URI 形式存储到 D1
- 支持通过原始 URI 或参数化表单两种方式录入节点
- 聚合第三方机场订阅与自有节点
- 将个人规则与上游规则集合并
- 输出带 Worker 托管 `rule-providers` 的 Clash/Mihomo 订阅
- 同时保留内联 Clash 配置兜底输出和原始 URI 输出

## 管理后台

访问地址：

```text
/admin
```

当前后台功能包括：

- 中文 / 英文切换
- 浅色 / 深色主题切换
- 概览、节点、订阅源、规则集四个页签布局
- Token 仅保存在当前浏览器
- 订阅链接预览与复制辅助
- 个人节点 CRUD
- 第三方订阅源 CRUD
- 管理 Token 与权限范围
- 双节点录入模式：
  - 原始 URI 模式
  - 参数模式，由系统帮助生成最终 URI
- 规则行构建器与规则列表编辑器
- 适用于高级 YAML 配置片段的 clash-fragment 原始编辑器

## 项目结构

- `src/index.ts`：Worker 路由入口
- `src/admin-ui.ts`：Worker 托管的管理后台
- `src/repositories.ts`：D1 持久化适配层
- `src/proxy.ts`：URI 解析与 Clash 转换
- `src/subscription-sources.ts`：第三方订阅源解析与聚合
- `src/rules.ts`：上游规则与个人规则的合并逻辑
- `migrations/`：D1 数据库结构迁移
- `wrangler.toml.example`：提交到仓库的配置模板
- `docs/cloudflare-deployment.md`：部署指南

## 数据模型

### `proxy_profiles`

- 用于存储 `ss://`、`vmess://`、`vless://` 或 `trojan://` 个人节点
- 参数模式编辑最终也会生成 URI 再落库存储

### `subscription_sources`

- 用于存储第三方机场订阅 URL
- 支持格式：
  - `auto`
  - `base64`
  - `uri-list`
  - `clash-yaml`

### `personal_rule_sets`

- `rule-lines`：可视化规则编辑，同时保存经典规则行
- `clash-fragment`：面向高级配置的原始 YAML 片段模式

### `admin_tokens`

- 仅保存 SHA-256 Token 摘要
- 明文 Token 只会在浏览器端创建时或引导脚本执行时展示一次

## 订阅输出

- `GET /api/subscription/clash`
- `GET /api/subscription/clash-inline`
- `GET /api/subscription/uri-list`
- `GET /api/subscription/base64`
- `GET /api/subscription/shadowsocks`

说明：

- `clash` 是推荐使用的、基于 provider 的 Mihomo 配置
- `clash-inline` 是展开后的兜底配置
- `Proxy` 是系统自动生成的默认代理策略组；没有显式目标组的规则也会默认回退到 `Proxy`
- 当规则引用了上游配置里不存在的策略组名时，`clash` 和 `clash-inline` 都会自动补一个候选为 `Proxy`、`DIRECT`、`REJECT` 的兜底 `select` 组
- `uri-list` 和 `base64` 会包含个人节点，以及支持 URI 的第三方订阅源内容
- 第三方 `clash-yaml` 订阅源会向 Clash 输出贡献代理节点，但除非订阅源本身提供 URI，否则不会进入原始 URI 输出

常见写法建议：

- 日常默认走代理：`DOMAIN-SUFFIX,example.com,Proxy`
- 想给一类流量单独一个开关组：`DOMAIN-SUFFIX,openai.com,AI`
- 想给工作流量单独控制：`DOMAIN-SUFFIX,company.com,Work`
- 想强制直连：`DOMAIN-SUFFIX,lan.example,DIRECT`
- 想强制拒绝：`DOMAIN-SUFFIX,ads.example,REJECT`

如果你写了 `AI`、`Work`、`Streaming` 这类上游里没有的组名，系统会自动补一个对应的 `select` 组，默认候选是：

```yaml
- name: AI
  type: select
  proxies:
    - Proxy
    - DIRECT
    - REJECT
```

这意味着它默认还是会先回退到 `Proxy`，只是你后续可以在客户端里把它手动切成 `DIRECT` 或别的策略。

## 校验与测试

常用命令：

- `npm run typecheck`
- `npm test`
- `npm run check`

它们分别表示：

- `typecheck`：运行 TypeScript 编译器做静态类型检查，不会启动 Worker，也不会真的访问 Cloudflare
- `test`：运行 Vitest，执行 `tests/**/*.test.ts` 里的测试用例
- `check`：先跑类型检查，再跑测试，适合作为提交前自检

这个仓库当前的测试主要是“接口级单元测试”：

- 直接调用 `handleRequest()`，不需要真的部署 Worker
- 用内存版仓库 `InMemoryRepository` 代替 D1
- 用假的 `fetchFn` 代替真实上游订阅请求
- 最后断言返回的状态码、JSON 和 YAML 文本是否符合预期

如果你不常写测试，可以先把它理解成：

- `typecheck` 负责抓“代码之间接线接错了没有”
- `test` 负责抓“业务行为是不是还是我们想要的”

## 部署

默认建议走引导脚本。

1. 安装依赖：

```bash
npm install
```

2. 首次登录 Cloudflare：

```bash
npx wrangler login
```

3. 运行引导脚本：

```bash
npm run cf:bootstrap
```

它会自动完成：

- 检查 `wrangler` 登录状态
- 创建远程 D1 数据库
- 基于 `wrangler.toml.example` 生成真实的本地 `wrangler.toml`
- 应用远程数据库迁移
- 生成初始 bootstrap token
- 将 token 哈希写入 D1
- 将明文 bootstrap token 写入 `.dev.vars`
- 可选写入 `UPSTREAM_RULESET_URL`
- 可选直接部署 Worker

注意：

- 提交 `wrangler.toml.example`
- 不要提交真实的 `wrangler.toml`
- 不要提交 `.dev.vars`

完整部署流程（包含手动兜底路径）见 [docs/cloudflare-deployment.md](./docs/cloudflare-deployment.md)。

## 本地开发

1. 如果不使用引导脚本，先从模板复制配置：

```bash
copy wrangler.toml.example wrangler.toml
```

2. 如有需要，执行本地迁移：

```bash
npm run db:migrate:local
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 运行检查：

```bash
npm run check
```

## Token 与权限模型

管理后台支持操作真实存储在 D1 中的 Token 与 Scope。

支持的 Scope：

- `admin:*`
- `subscriptions:read`
- `proxies:read`
- `proxies:write`
- `sources:read`
- `sources:write`
- `rules:read`
- `rules:write`
- `tokens:read`
- `tokens:write`

推荐的生产环境拆分方式：

- 一个具备写权限的管理 Token
- 一个仅带 `subscriptions:read` 的订阅 Token

## 验证

执行：

```bash
npm run check
```
