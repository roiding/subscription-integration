const adminStyles = String.raw`
:root {
  color-scheme: light;
  --paper: #f7f1e7;
  --paper-strong: #fff9f0;
  --paper-soft: rgba(255, 250, 242, 0.78);
  --ink: #13231e;
  --ink-soft: #557067;
  --ink-faint: #7e978d;
  --line: rgba(19, 35, 30, 0.12);
  --line-strong: rgba(19, 35, 30, 0.2);
  --accent: #0c9271;
  --accent-strong: #075845;
  --accent-pale: rgba(12, 146, 113, 0.13);
  --berry: #7f3450;
  --sun: #edb35f;
  --card-shadow: 0 22px 70px rgba(18, 36, 31, 0.12);
  --radius-xl: 28px;
  --radius-lg: 22px;
  --radius-md: 16px;
  --radius-sm: 12px;
  --mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
  --sans: "Space Grotesk", "Segoe UI", sans-serif;
}

html[data-theme="dark"] {
  color-scheme: dark;
  --paper: #0f1715;
  --paper-strong: #15211d;
  --paper-soft: rgba(21, 33, 29, 0.9);
  --ink: #edf8f2;
  --ink-soft: #a6bcb3;
  --ink-faint: #7f958d;
  --line: rgba(230, 245, 236, 0.08);
  --line-strong: rgba(230, 245, 236, 0.14);
  --accent: #31c9a0;
  --accent-strong: #91f3d5;
  --accent-pale: rgba(49, 201, 160, 0.16);
  --berry: #f39ec0;
  --sun: #f4c981;
  --card-shadow: 0 22px 80px rgba(0, 0, 0, 0.32);
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background:
    radial-gradient(circle at top left, rgba(237, 179, 95, 0.18), transparent 30%),
    radial-gradient(circle at top right, rgba(127, 52, 80, 0.12), transparent 24%),
    linear-gradient(180deg, var(--paper) 0%, color-mix(in srgb, var(--paper) 90%, black 10%) 100%);
  color: var(--ink);
  font-family: var(--sans);
}

body {
  padding: 24px 16px 42px;
}

a {
  color: inherit;
}

button,
input,
select,
textarea {
  font: inherit;
}

.shell {
  width: min(1460px, 100%);
  margin: 0 auto;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 22px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 12px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--berry);
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 5vw, 62px);
  line-height: 0.95;
  letter-spacing: -0.05em;
}

.hero p {
  max-width: 860px;
  margin: 14px 0 0;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.72;
}

.hero-status {
  min-width: 250px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--paper-soft);
  box-shadow: var(--card-shadow);
  backdrop-filter: blur(18px);
}

.topbar,
.panel,
.list-card,
.preview-box,
.link-card {
  border: 1px solid var(--line);
  background: var(--paper-soft);
  box-shadow: var(--card-shadow);
  backdrop-filter: blur(18px);
}

.topbar,
.panel {
  border-radius: var(--radius-xl);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  margin-bottom: 14px;
}

.control-cluster {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.cluster-label {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
  font-family: var(--mono);
}

.segment {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(19, 35, 30, 0.08);
}

html[data-theme="dark"] .segment {
  background: rgba(230, 245, 236, 0.08);
}

.segment button,
.tab-button,
.button-link,
button {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 11px 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, color 160ms ease;
}

.segment button:hover,
.tab-button:hover,
button:hover,
.button-link:hover {
  transform: translateY(-1px);
}

.segment button {
  background: transparent;
  color: var(--ink-soft);
}

.segment button.is-active {
  background: var(--paper-strong);
  color: var(--ink);
  box-shadow: 0 10px 22px rgba(17, 37, 32, 0.08);
}

html[data-theme="dark"] .segment button.is-active {
  background: rgba(255, 255, 255, 0.08);
}

.tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tab-button {
  background: rgba(19, 35, 30, 0.08);
  color: var(--ink-soft);
}

html[data-theme="dark"] .tab-button {
  background: rgba(230, 245, 236, 0.08);
}

.tab-button.is-active {
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 72%, white 28%));
  color: white;
  box-shadow: 0 12px 28px rgba(12, 146, 113, 0.26);
}

.tab-panel.is-hidden,
.mode-panel.is-hidden,
.protocol-only.is-hidden,
.network-only.is-hidden,
.security-only.is-hidden,
.hidden {
  display: none !important;
}

.panel {
  overflow: hidden;
}

.panel.pad,
.editor-shell {
  padding: 22px;
}

.overview-grid,
.workspace-grid,
.grid-two,
.grid-three,
.link-grid {
  display: grid;
  gap: 14px;
}

.overview-grid {
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
}

.workspace-grid {
  grid-template-columns: minmax(320px, 0.92fr) minmax(380px, 1.08fr);
}

.grid-two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.link-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.section-head h2,
.section-head h3,
.section-head h4 {
  margin: 0;
  letter-spacing: -0.03em;
}

.section-head h2,
.section-head h3 {
  font-size: 22px;
}

.section-head p {
  margin: 6px 0 0;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.65;
}

.status-chip,
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-chip {
  background: rgba(19, 35, 30, 0.08);
  color: var(--ink);
}

.status-chip::before {
  content: "";
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #8a8a8a;
}

.status-chip.ok {
  background: rgba(12, 146, 113, 0.16);
  color: var(--accent-strong);
}

.status-chip.ok::before {
  background: var(--accent);
}

.status-chip.warn {
  background: rgba(237, 179, 95, 0.18);
  color: #8f6013;
}

.status-chip.warn::before {
  background: var(--sun);
}

.status-chip.error {
  background: rgba(127, 52, 80, 0.16);
  color: var(--berry);
}

.status-chip.error::before {
  background: var(--berry);
}

.status-meta,
.hint,
.mono-hint,
.muted,
.empty-state p,
.list-card p {
  color: var(--ink-soft);
}

.status-meta,
.hint,
.mono-hint,
.muted,
.list-card p {
  font-size: 13px;
  line-height: 1.65;
}

.mono-hint,
.mono-text,
.link-card a,
.preview-box pre,
.preview-box code {
  font-family: var(--mono);
  font-size: 12px;
  word-break: break-all;
}

.pill-row,
.button-row,
.link-actions,
.list-actions,
.editor-actions,
.stack-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.builder-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.06);
  padding: 16px;
  margin-bottom: 16px;
}

.line-list {
  display: grid;
  gap: 10px;
}

.line-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.scope-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.scope-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.scope-pill input {
  width: auto;
  margin: 0;
}

.token-preview {
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-md);
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
}

.token-preview pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--mono);
  font-size: 12px;
}

.builder-card h4 {
  margin: 0 0 8px;
}

.builder-card p {
  margin: 0 0 12px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.65;
}

.inline-field-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.builder-note {
  margin-top: 10px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.65;
}

.pill {
  background: rgba(19, 35, 30, 0.08);
  color: var(--ink);
}

.pill--accent {
  background: var(--accent-pale);
  color: var(--accent-strong);
}

.pill--berry {
  background: rgba(127, 52, 80, 0.14);
  color: var(--berry);
}

.button-primary {
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 72%, white 28%));
  color: white;
  box-shadow: 0 14px 30px rgba(12, 146, 113, 0.28);
}

.button-secondary {
  background: rgba(19, 35, 30, 0.08);
  color: var(--ink);
}

.button-ghost {
  background: transparent;
  color: var(--ink-soft);
  border: 1px solid var(--line);
}

.button-danger {
  background: rgba(127, 52, 80, 0.12);
  color: var(--berry);
}

.button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.field,
.field-wide {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.field-wide {
  margin-bottom: 16px;
}

label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.82);
  color: var(--ink);
  padding: 12px 14px;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

html[data-theme="dark"] input,
html[data-theme="dark"] select,
html[data-theme="dark"] textarea {
  background: rgba(255, 255, 255, 0.04);
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: rgba(12, 146, 113, 0.46);
  box-shadow: 0 0 0 4px rgba(12, 146, 113, 0.12);
}

textarea {
  min-height: 132px;
  resize: vertical;
}

.list-stack {
  display: grid;
  gap: 12px;
  max-height: 680px;
  overflow: auto;
  padding-right: 4px;
}

.list-card,
.preview-box,
.link-card {
  border-radius: var(--radius-lg);
}

.list-card,
.link-card {
  padding: 16px;
}

.list-card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 10px;
}

.preview-box {
  padding: 14px;
  margin-top: 16px;
}

.preview-box h4,
.link-card h4,
.list-card h4 {
  margin: 0 0 8px;
}

.preview-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.mode-switch {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(19, 35, 30, 0.08);
  margin-bottom: 16px;
}

html[data-theme="dark"] .mode-switch {
  background: rgba(230, 245, 236, 0.08);
}

.mode-switch button {
  background: transparent;
  color: var(--ink-soft);
}

.mode-switch button.is-active {
  background: var(--paper-strong);
  color: var(--ink);
  box-shadow: 0 10px 22px rgba(17, 37, 32, 0.08);
}

html[data-theme="dark"] .mode-switch button.is-active {
  background: rgba(255, 255, 255, 0.08);
}

.empty-state {
  padding: 22px;
}

.empty-state h4 {
  margin: 0 0 8px;
}

.toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  min-width: 220px;
  max-width: min(420px, calc(100vw - 40px));
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: rgba(19, 35, 30, 0.92);
  color: white;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 180ms ease, transform 180ms ease;
  z-index: 40;
}

.toast.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.toast.is-error {
  background: rgba(127, 52, 80, 0.96);
}

@media (max-width: 1150px) {
  .hero,
  .topbar,
  .overview-grid,
  .workspace-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .hero-status {
    width: 100%;
  }

  .topbar {
    align-items: stretch;
  }
}

@media (max-width: 760px) {
  body {
    padding: 14px 12px 28px;
  }

  .panel.pad,
  .editor-shell {
    padding: 18px;
  }

  .grid-two,
  .grid-three,
  .overview-grid,
  .workspace-grid,
  .toolbar-row,
  .inline-field-row,
  .scope-grid {
    grid-template-columns: 1fr;
  }

  .tabs,
  .button-row,
  .link-actions,
  .editor-actions {
    width: 100%;
  }

  .tab-button,
  .button-primary,
  .button-secondary,
  .button-ghost,
  .button-danger {
    width: 100%;
    justify-content: center;
  }
}
`;

const adminScript = String.raw`
(() => {
  const storageKey = 'v2ray-worker-admin-console-v3';
  const translations = {
    zh: {
      documentTitle: 'Subscription Atelier',
      eyebrow: 'Workers 控制台',
      heroTitle: 'Subscription Atelier',
      heroBody: '这个管理台直接运行在你的 Worker 里。节点仍然以 URI 存进 D1，但你不必再手写 URI：可以直接按参数录入，尤其适合你后面频繁调整 CF 优选 IP、SNI、Path、Reality、gRPC 等字段。',
      controlTheme: '主题',
      controlLanguage: '语言',
      themeLight: '白天',
      themeDark: '夜晚',
      languageZh: '中文',
      languageEn: 'EN',
      tabOverview: '概览',
      tabNodes: '节点',
      tabSources: '订阅源',
      tabRules: '规则',
      sessionWaiting: '等待令牌',
      sessionConnecting: '连接中',
      sessionConnected: '已连接',
      sessionFailed: '连接失败',
      sessionCleared: '会话已清除',
      sessionMetaIdle: '令牌只保存在这个浏览器里。参数模式最后仍会把节点组装成 URI 再写入 D1。',
      sessionMetaConnected: '管理接口认证成功，下面的订阅链接可以直接复制使用。',
      sessionMetaFailed: 'Worker 可达，但当前管理令牌被拒绝或请求失败。',
      accessTitle: '访问与令牌',
      accessDesc: '管理令牌用于 CRUD。若你以后把管理令牌和订阅令牌分开，可在这里额外填订阅令牌，让页面预览出客户端真正该用的链接。',
      tokensTitle: '管理令牌与权限',
      tokensDesc: '这里管理真正写入 D1 的访问令牌。明文 token 只会在你创建或轮换时显示一次，数据库里保存的始终是 SHA-256。',
      newTokenButton: '新建令牌',
      tokensEmptyTitle: '还没有额外的管理令牌',
      tokensEmptyBody: '建议至少分出一个只读订阅 token 和一个有写权限的管理 token。',
      tokenEditorCreate: '创建访问令牌',
      tokenEditorEdit: '编辑访问令牌',
      tokenEditorDesc: '可以只改权限和启停，也可以生成一个新明文 token 来轮换。前端会先算 SHA-256，再提交给后端。',
      tokenNameLabel: '令牌名称',
      tokenNotesLabel: '令牌备注',
      tokenPlaintextLabel: '明文 Token',
      tokenPlaintextHint: '创建时必须有明文 token。编辑时留空表示不轮换；如果点“生成新 token”，保存时会自动替换 hash。',
      tokenGenerateButton: '生成新 Token',
      tokenScopesLabel: '权限范围',
      tokenScopeAdmin: 'admin:*（全权限）',
      tokenScopeSubscriptionsRead: 'subscriptions:read（订阅只读）',
      tokenScopeProxiesRead: 'proxies:read',
      tokenScopeProxiesWrite: 'proxies:write',
      tokenScopeSourcesRead: 'sources:read',
      tokenScopeSourcesWrite: 'sources:write',
      tokenScopeRulesRead: 'rules:read',
      tokenScopeRulesWrite: 'rules:write',
      tokenScopeTokensRead: 'tokens:read',
      tokenScopeTokensWrite: 'tokens:write',
      tokenPreviewTitle: '本次生成的明文 Token',
      tokenPreviewHint: '请自行妥善保存。后端不会再返回明文，只会保存 hash。',
      saveTokenButton: '保存令牌',
      resetTokenButton: '重置令牌编辑器',
      tokenCreatedToast: '访问令牌已创建。',
      tokenUpdatedToast: '访问令牌已更新。',
      tokenDeletedToast: '访问令牌已删除。',
      tokenGeneratedToast: '已生成新的明文 token。保存后才会真正写入 D1。',
      deleteTokenConfirm: '确认删除令牌 “{name}” 吗？',
      fieldTokenName: '令牌名称',
      adminTokenLabel: '管理令牌',
      adminTokenHint: '用于节点 CRUD 和规则 CRUD。',
      subscriptionTokenLabel: '订阅令牌覆盖',
      subscriptionTokenHint: '可选。留空时，订阅链接会直接复用管理令牌。',
      upstreamOverrideLabel: '预览上游覆盖地址',
      upstreamOverrideHint: '只影响页面里生成的预览链接，不会改线上默认 secret。',
      connectButton: '连接管理台',
      clearSessionButton: '清除本地会话',
      linksTitle: '订阅链接',
      linksDesc: '推荐给 OpenClash、Clash Mi、Clash Verge Rev、Stash 的是 provider-backed Clash 链接；inline 版本留作兼容回退。',
      clashLinkTitle: 'Clash / Mihomo',
      clashInlineTitle: 'Clash Inline 回退',
      uriListTitle: '原始 URI 列表',
      base64Title: 'Base64 节点订阅',
      copyButton: '复制',
      searchNodesLabel: '搜索节点',
      searchNodesPlaceholder: '按名称、标签、URI、协议搜索',
      filterProtocolLabel: '协议过滤',
      filterProtocolAll: '全部协议',
      nodesTitle: '个人节点',
      nodesDesc: '看列表、改参数、贴现成 URI 都可以。你后面改 CF 优选 IP 时，参数模式会比手工改 URI 省心得多。',
      newNodeButton: '新建节点',
      nodesEmptyTitle: '还没有个人节点',
      nodesEmptyBody: '如果你准备频繁调整优选 IP、SNI、Path、Reality 字段，建议直接从参数模式开始。',
      proxyEditorCreate: '创建个人节点',
      proxyEditorEdit: '编辑个人节点',
      proxyEditorDesc: 'URI 模式适合快速粘贴，参数模式适合长期维护。',
      nodeNameLabel: '节点名称',
      priorityLabel: '优先级',
      tagsLabel: '标签',
      tagsHint: '逗号分隔。后面你按区域、传输方式、优选 IP 池来分组时会很好用。',
      notesLabel: '备注',
      notesPlaceholder: '可写到期时间、适用场景、优选 IP 批次、机场备注等。',
      enabledLabel: '启用',
      modeManual: '参数模式',
      modeUri: 'URI 模式',
      rawUriLabel: '原始 URI',
      rawUriPlaceholder: '粘贴 ss://、vmess://、vless:// 或 trojan://',
      importUriButton: '把 URI 拆进参数模式',
      protocolLabel: '协议',
      hostLabel: '服务器 / Host',
      hostPlaceholder: '优选 IP 或源站域名',
      portLabel: '端口',
      uuidLabel: 'UUID',
      passwordLabel: '密码',
      cipherLabel: '加密方式',
      alterIdLabel: 'Alter ID',
      flowLabel: 'Flow',
      networkLabel: '传输方式',
      securityLabel: '安全层',
      sniLabel: 'SNI / Server Name',
      hostHeaderLabel: 'Host 头',
      pathLabel: 'Path',
      grpcServiceLabel: 'gRPC Service Name',
      allowInsecureLabel: '允许不校验证书',
      realityPublicKeyLabel: 'Reality Public Key',
      realityShortIdLabel: 'Reality Short ID',
      ssPluginLabel: 'SS 插件',
      ssPluginOptsLabel: 'SS 插件参数',
      clashOverridesLabel: '高级 Clash Overrides（JSON）',
      clashOverridesPlaceholder: '仅当页面没有暴露你要的字段时，再在这里补 JSON 覆盖。',
      uriPreviewTitle: '生成的 URI 预览',
      saveNodeButton: '保存节点',
      resetEditorButton: '重置编辑器',
      rulesTitle: '个人规则集',
      rulesDesc: '把你自己的规则与上游规则源分开管理，这样后续改策略不会影响上游原始文件。',
      newRuleSetButton: '新建规则集',
      rulesEmptyTitle: '还没有个人规则集',
      rulesEmptyBody: '可以先用 rule-lines 写常用域名规则，复杂情况再切到 clash-fragment。',
      ruleEditorCreate: '创建个人规则集',
      ruleEditorEdit: '编辑个人规则集',
      ruleEditorDesc: '日常建议优先用 rule-lines。需要加 group/provider/YAML 结构时再用 clash-fragment。',
      ruleSetNameLabel: '规则集名称',
      formatLabel: '格式',
      ruleNotesLabel: '备注',
      ruleNotesPlaceholder: '可写用途、策略目标、和上游的优先级关系。',
      ruleContentLabel: '规则内容',
      ruleContentHint: 'rule-lines 模式每行一条 Mihomo classical rule。clash-fragment 模式可包含 rules、proxy-groups、rule-providers、proxies。',
      ruleBuilderTitle: '规则构造器',
      ruleBuilderDesc: '最后那个 Proxy 不是规则集名，而是“策略目标 / policy target”。意思是命中后把流量交给哪个策略组处理。',
      ruleTypeLabel: '规则类型',
      ruleValueLabel: '匹配值',
      ruleTargetLabel: '策略目标',
      ruleTargetCustomLabel: '自定义策略目标',
      ruleExtraLabel: '附加选项',
      ruleExtraNone: '无',
      ruleExtraNoResolve: 'no-resolve',
      ruleTargetProxy: 'Proxy',
      ruleTargetDirect: 'DIRECT',
      ruleTargetReject: 'REJECT',
      ruleTargetAuto: 'Auto',
      ruleTargetCustom: '自定义...',
      addRuleLineButton: '追加到规则内容',
      ruleBuilderHelper: '例如 DOMAIN-SUFFIX,google.com,Proxy 表示命中 google.com 的流量交给 Proxy 这个策略组，而不是交给某个规则集对象。',
      ruleBuilderAddedToast: '规则行已追加到内容编辑框。',
      saveRuleButton: '保存规则集',
      resetRuleButton: '重置编辑器',
      loginFirstLink: '请先登录后再生成订阅链接。',
      noNotesYet: '暂无备注。',
      enabledPill: '启用中',
      disabledPill: '已停用',
      priorityShort: '优先级',
      edit: '编辑',
      clone: '克隆',
      del: '删除',
      cloneProxyToast: '已把节点内容复制到编辑器，你可以直接改 IP、SNI、Path 或其它参数。',
      sourcesTitle: '第三方订阅源',
      sourcesDesc: '这里配置机场订阅地址。它们会在生成订阅时与个人节点一起聚合。可理解为“节点来源”，不是规则来源。',
      newSourceButton: '新增订阅源',
      sourcesEmptyTitle: '还没有第三方订阅源',
      sourcesEmptyBody: '先加一个机场订阅链接。支持 auto、base64、uri-list、clash-yaml 四种模式。',
      sourceEditorCreate: '创建第三方订阅源',
      sourceEditorEdit: '编辑第三方订阅源',
      sourceEditorDesc: 'URL 一般就是机场给你的订阅地址。auto 会自动识别 base64 / uri-list / clash-yaml。',
      sourceNameLabel: '订阅源名称',
      sourceUrlLabel: '订阅源 URL',
      sourceFormatLabel: '订阅源格式',
      sourceNotesLabel: '订阅源备注',
      sourceFormatAuto: '自动识别',
      sourceFormatUriList: 'URI 列表',
      sourceFormatBase64: 'Base64 节点订阅',
      sourceFormatClashYaml: 'Clash YAML',
      saveSourceButton: '保存订阅源',
      resetSourceButton: '重置订阅源编辑器',
      sourceCreatedToast: '第三方订阅源已创建。',
      sourceUpdatedToast: '第三方订阅源已更新。',
      sourceDeletedToast: '第三方订阅源已删除。',
      deleteSourceConfirm: '确认删除订阅源 “{name}” 吗？',
      fieldSourceName: '订阅源名称',
      fieldSourceUrl: '订阅源 URL',
      waitingFields: '还缺一些必要字段：',
      summaryRaw: '以原始 URI 形式保存',
      tokenClearedToast: '本地浏览器里的令牌已清除。',
      enterAdminTokenToast: '请先输入管理令牌。',
      noLinkToast: '现在还没有可复制的订阅链接。',
      copiedToast: '订阅链接已复制。',
      importUriMissingToast: '请先粘贴一个 URI，再执行拆解。',
      importUriSuccessToast: 'URI 已成功拆解进参数编辑器。',
      proxyCreatedToast: '个人节点已创建。',
      proxyUpdatedToast: '个人节点已更新。',
      proxyDeletedToast: '个人节点已删除。',
      ruleCreatedToast: '个人规则集已创建。',
      ruleUpdatedToast: '个人规则集已更新。',
      ruleDeletedToast: '个人规则集已删除。',
      deleteProxyConfirm: '确认删除节点 “{name}” 吗？',
      deleteRuleConfirm: '确认删除规则集 “{name}” 吗？',
      fieldNodeName: '节点名称',
      fieldUri: '节点 URI',
      fieldRuleName: '规则集名称',
      fieldRuleContent: '规则集内容',
      fieldHost: '服务器 / Host',
      fieldPort: '端口',
      fieldUuid: 'UUID',
      fieldPassword: '密码',
      fieldCipher: '加密方式',
      fieldRealityPublicKey: 'Reality Public Key',
      invalidOverrides: 'Clash overrides 必须是一个 JSON 对象。',
      unsupportedProtocol: '这个协议暂时不能自动拆解到参数模式：',
      invalidUri: 'URI 格式不完整，无法自动拆解。'
    },
    en: {
      documentTitle: 'Subscription Atelier',
      eyebrow: 'Workers Control Surface',
      heroTitle: 'Subscription Atelier',
      heroBody: 'This admin console lives inside your Worker. Nodes still land in D1 as URIs, but you no longer need to hand-edit those URIs: use field-based input whenever you want to tune CF preferred IPs, SNI, paths, Reality keys, gRPC service names, or transport settings.',
      controlTheme: 'Theme',
      controlLanguage: 'Language',
      themeLight: 'Light',
      themeDark: 'Dark',
      languageZh: '中文',
      languageEn: 'EN',
      tabOverview: 'Overview',
      tabNodes: 'Nodes',
      tabSources: 'Sources',
      tabRules: 'Rule Sets',
      sessionWaiting: 'Waiting For Token',
      sessionConnecting: 'Connecting',
      sessionConnected: 'Connected',
      sessionFailed: 'Connection Failed',
      sessionCleared: 'Session Cleared',
      sessionMetaIdle: 'Tokens stay in this browser only. Parameter mode still stores the final node as a URI in D1.',
      sessionMetaConnected: 'Admin API authenticated. The subscription links below are ready to copy.',
      sessionMetaFailed: 'The Worker is reachable, but the current admin token was rejected or the request failed.',
      accessTitle: 'Access Vault',
      accessDesc: 'Use the admin token for CRUD. If you later split admin and subscription tokens, add the subscription token here so the preview links reflect what your clients should really use.',
      tokensTitle: 'Managed Tokens & Permissions',
      tokensDesc: 'Manage the real access tokens stored in D1. Plaintext tokens are only shown once when you create or rotate them; the database keeps SHA-256 hashes only.',
      newTokenButton: 'New Token',
      tokensEmptyTitle: 'No extra managed tokens yet.',
      tokensEmptyBody: 'A common next step is to separate a read-only subscription token from a write-capable admin token.',
      tokenEditorCreate: 'Create Access Token',
      tokenEditorEdit: 'Edit Access Token',
      tokenEditorDesc: 'You can change scopes and enabled state only, or generate a new plaintext token to rotate the hash. Hashing happens in the browser before the payload is sent.',
      tokenNameLabel: 'Token Name',
      tokenNotesLabel: 'Token Notes',
      tokenPlaintextLabel: 'Plaintext Token',
      tokenPlaintextHint: 'Plaintext is required when creating a token. During edits, leave it blank to keep the existing hash, or generate a new token to rotate it.',
      tokenGenerateButton: 'Generate New Token',
      tokenScopesLabel: 'Scopes',
      tokenScopeAdmin: 'admin:* (full access)',
      tokenScopeSubscriptionsRead: 'subscriptions:read',
      tokenScopeProxiesRead: 'proxies:read',
      tokenScopeProxiesWrite: 'proxies:write',
      tokenScopeSourcesRead: 'sources:read',
      tokenScopeSourcesWrite: 'sources:write',
      tokenScopeRulesRead: 'rules:read',
      tokenScopeRulesWrite: 'rules:write',
      tokenScopeTokensRead: 'tokens:read',
      tokenScopeTokensWrite: 'tokens:write',
      tokenPreviewTitle: 'Generated Plaintext Token',
      tokenPreviewHint: 'Store it somewhere safe. The backend will never send the plaintext token back again.',
      saveTokenButton: 'Save Token',
      resetTokenButton: 'Reset Token Editor',
      tokenCreatedToast: 'Access token created.',
      tokenUpdatedToast: 'Access token updated.',
      tokenDeletedToast: 'Access token deleted.',
      tokenGeneratedToast: 'A new plaintext token was generated. Save to persist its hash.',
      deleteTokenConfirm: 'Delete token “{name}”?',
      fieldTokenName: 'Token name',
      adminTokenLabel: 'Admin Token',
      adminTokenHint: 'Required for proxy CRUD and rule-set CRUD.',
      subscriptionTokenLabel: 'Subscription Token Override',
      subscriptionTokenHint: 'Optional. Leave blank to reuse the admin token for previews.',
      upstreamOverrideLabel: 'Preview Upstream Override',
      upstreamOverrideHint: 'Only affects the preview links shown in this page.',
      connectButton: 'Connect Console',
      clearSessionButton: 'Clear Local Session',
      linksTitle: 'Subscription Links',
      linksDesc: 'Preferred for OpenClash, Clash Mi, Clash Verge Rev, and Stash: use the provider-backed Clash link. Keep the inline variant as a fallback.',
      clashLinkTitle: 'Clash / Mihomo',
      clashInlineTitle: 'Clash Inline Fallback',
      uriListTitle: 'Raw URI List',
      base64Title: 'Base64 Node Feed',
      copyButton: 'Copy',
      searchNodesLabel: 'Search Nodes',
      searchNodesPlaceholder: 'Search by name, tags, URI, or protocol',
      filterProtocolLabel: 'Protocol Filter',
      filterProtocolAll: 'All Protocols',
      nodesTitle: 'Personal Nodes',
      nodesDesc: 'Review stored URIs, edit transport parameters, or start from a clean field-based node definition.',
      newNodeButton: 'New Node',
      nodesEmptyTitle: 'No personal nodes yet.',
      nodesEmptyBody: 'If you expect to change preferred IPs, SNI, paths, or Reality fields often, start with parameter mode instead of raw URI mode.',
      proxyEditorCreate: 'Create Personal Node',
      proxyEditorEdit: 'Edit Personal Node',
      proxyEditorDesc: 'URI mode is quick paste-in. Parameter mode is the safer long-term workflow.',
      nodeNameLabel: 'Node Name',
      priorityLabel: 'Priority',
      tagsLabel: 'Tags',
      tagsHint: 'Comma separated. Helpful later when grouping nodes by region, transport, or preferred IP pool.',
      notesLabel: 'Notes',
      notesPlaceholder: 'Optional reminders about expiration, use case, preferred IP batch, or provider notes.',
      enabledLabel: 'Enabled',
      modeManual: 'Parameter Mode',
      modeUri: 'URI Mode',
      rawUriLabel: 'Raw URI',
      rawUriPlaceholder: 'Paste an ss://, vmess://, vless://, or trojan:// URI.',
      importUriButton: 'Import URI Into Parameter Mode',
      protocolLabel: 'Protocol',
      hostLabel: 'Server / Host',
      hostPlaceholder: 'Preferred CF IP or origin domain',
      portLabel: 'Port',
      uuidLabel: 'UUID',
      passwordLabel: 'Password',
      cipherLabel: 'Cipher',
      alterIdLabel: 'Alter ID',
      flowLabel: 'Flow',
      networkLabel: 'Transport',
      securityLabel: 'Security',
      sniLabel: 'SNI / Server Name',
      hostHeaderLabel: 'Host Header',
      pathLabel: 'Path',
      grpcServiceLabel: 'gRPC Service Name',
      allowInsecureLabel: 'Allow Insecure',
      realityPublicKeyLabel: 'Reality Public Key',
      realityShortIdLabel: 'Reality Short ID',
      ssPluginLabel: 'SS Plugin',
      ssPluginOptsLabel: 'SS Plugin Options',
      clashOverridesLabel: 'Advanced Clash Overrides (JSON)',
      clashOverridesPlaceholder: 'Only use JSON overrides when the visual editor does not expose the field you need.',
      uriPreviewTitle: 'Generated URI Preview',
      saveNodeButton: 'Save Node',
      resetEditorButton: 'Reset Editor',
      rulesTitle: 'Personal Rule Sets',
      rulesDesc: 'Keep your own policy fragments separate from the upstream source so you can evolve them independently.',
      newRuleSetButton: 'New Rule Set',
      rulesEmptyTitle: 'No personal rule sets yet.',
      rulesEmptyBody: 'Start with plain rule-lines for everyday work, then switch to clash-fragment for more advanced YAML pieces.',
      ruleEditorCreate: 'Create Personal Rule Set',
      ruleEditorEdit: 'Edit Personal Rule Set',
      ruleEditorDesc: 'Use rule-lines for daily policy work. Use clash-fragment when you need groups, providers, or structured YAML pieces.',
      ruleSetNameLabel: 'Rule Set Name',
      formatLabel: 'Format',
      ruleNotesLabel: 'Notes',
      ruleNotesPlaceholder: 'Optional purpose, target group, or ordering reminder.',
      ruleContentLabel: 'Rule Content',
      ruleContentHint: 'Rule-lines mode expects one Mihomo classical rule per line. Clash-fragment mode can include rules, proxy-groups, rule-providers, or proxies.',
      ruleBuilderTitle: 'Rule Builder',
      ruleBuilderDesc: 'The final segment is not the rule-set name. It is the policy target: the proxy group that should handle matched traffic.',
      ruleTypeLabel: 'Rule Type',
      ruleValueLabel: 'Match Value',
      ruleTargetLabel: 'Policy Target',
      ruleTargetCustomLabel: 'Custom Policy Target',
      ruleExtraLabel: 'Extra Option',
      ruleExtraNone: 'None',
      ruleExtraNoResolve: 'no-resolve',
      ruleTargetProxy: 'Proxy',
      ruleTargetDirect: 'DIRECT',
      ruleTargetReject: 'REJECT',
      ruleTargetAuto: 'Auto',
      ruleTargetCustom: 'Custom...',
      addRuleLineButton: 'Append To Rule Content',
      ruleBuilderHelper: 'For example, DOMAIN-SUFFIX,google.com,Proxy means matching traffic is sent to the Proxy policy group, not to a rule-set object.',
      ruleBuilderAddedToast: 'The rule line was appended to the content editor.',
      saveRuleButton: 'Save Rule Set',
      resetRuleButton: 'Reset Editor',
      loginFirstLink: 'Login first to generate a subscription URL.',
      noNotesYet: 'No notes yet.',
      enabledPill: 'Enabled',
      disabledPill: 'Disabled',
      priorityShort: 'Priority',
      edit: 'Edit',
      clone: 'Clone',
      del: 'Delete',
      cloneProxyToast: 'The node has been copied into the editor so you can tweak IP, SNI, path, or transport details.',
      sourcesTitle: 'Third-Party Subscription Sources',
      sourcesDesc: 'Configure airport subscription URLs here. They are aggregated with your personal nodes during subscription generation, so think of them as node sources rather than rule sources.',
      newSourceButton: 'New Source',
      sourcesEmptyTitle: 'No third-party subscription sources yet.',
      sourcesEmptyBody: 'Add an airport subscription URL first. Supported modes: auto, base64, uri-list, and clash-yaml.',
      sourceEditorCreate: 'Create Subscription Source',
      sourceEditorEdit: 'Edit Subscription Source',
      sourceEditorDesc: 'The URL is usually the airport subscription link itself. Auto mode will detect base64, uri-list, or clash-yaml when possible.',
      sourceNameLabel: 'Source Name',
      sourceUrlLabel: 'Source URL',
      sourceFormatLabel: 'Source Format',
      sourceNotesLabel: 'Source Notes',
      sourceFormatAuto: 'Auto Detect',
      sourceFormatUriList: 'URI List',
      sourceFormatBase64: 'Base64 Node Feed',
      sourceFormatClashYaml: 'Clash YAML',
      saveSourceButton: 'Save Source',
      resetSourceButton: 'Reset Source Editor',
      sourceCreatedToast: 'Third-party subscription source created.',
      sourceUpdatedToast: 'Third-party subscription source updated.',
      sourceDeletedToast: 'Third-party subscription source deleted.',
      deleteSourceConfirm: 'Delete subscription source “{name}”?',
      fieldSourceName: 'Source name',
      fieldSourceUrl: 'Source URL',
      waitingFields: 'Waiting for enough fields: ',
      summaryRaw: 'Stored as raw URI',
      tokenClearedToast: 'Local browser tokens cleared.',
      enterAdminTokenToast: 'Enter an admin token first.',
      noLinkToast: 'There is no subscription link to copy yet.',
      copiedToast: 'Subscription link copied.',
      importUriMissingToast: 'Paste a URI first, then import it.',
      importUriSuccessToast: 'URI parsed into the parameter editor.',
      proxyCreatedToast: 'Personal node created.',
      proxyUpdatedToast: 'Personal node updated.',
      proxyDeletedToast: 'Personal node deleted.',
      ruleCreatedToast: 'Personal rule set created.',
      ruleUpdatedToast: 'Personal rule set updated.',
      ruleDeletedToast: 'Personal rule set deleted.',
      deleteProxyConfirm: 'Delete node “{name}”?',
      deleteRuleConfirm: 'Delete rule set “{name}”?',
      fieldNodeName: 'Node name',
      fieldUri: 'Node URI',
      fieldRuleName: 'Rule set name',
      fieldRuleContent: 'Rule set content',
      fieldHost: 'Server / host',
      fieldPort: 'Port',
      fieldUuid: 'UUID',
      fieldPassword: 'Password',
      fieldCipher: 'Cipher',
      fieldRealityPublicKey: 'Reality public key',
      invalidOverrides: 'Clash overrides must be a JSON object.',
      unsupportedProtocol: 'Unsupported protocol for manual import: ',
      invalidUri: 'The URI is incomplete and cannot be expanded into fields.'
    }
  };

  const state = {
    adminToken: '',
    subscriptionToken: '',
    upstreamOverride: '',
    managedTokens: [],
    proxies: [],
    subscriptionSources: [],
    ruleSets: [],
    ruleLineItems: [],
    editingManagedTokenId: null,
    editingProxyId: null,
    editingSourceId: null,
    editingRuleSetId: null,
    proxyMode: 'manual',
    activeTab: 'overview',
    locale: 'zh',
    theme: 'light'
  };

  const refs = {};
  let toastTimer = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cacheRefs();
    loadSettings();
    bindEvents();
    applyTheme();
    applyLocale();
    setActiveTab(state.activeTab);
    resetTokenEditor();
    resetProxyEditor(state.proxyMode);
    resetSourceEditor();
    resetRuleSetEditor();
    updateSessionChip('warn', 'sessionWaiting');
    renderSubscriptionLinks();
    renderTokenList();
    renderProxyList();
    renderSourceList();
    renderRuleSetList();
    if (state.adminToken) {
      connect();
    }
  }

  function cacheRefs() {
    refs.themeButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));
    refs.localeButtons = Array.from(document.querySelectorAll('[data-locale-choice]'));
    refs.tabButtons = Array.from(document.querySelectorAll('[data-tab-button]'));
    refs.tabPanels = Array.from(document.querySelectorAll('[data-tab-panel]'));
    refs.accessForm = document.getElementById('access-form');
    refs.adminToken = document.getElementById('admin-token');
    refs.subscriptionToken = document.getElementById('subscription-token');
    refs.upstreamOverride = document.getElementById('upstream-override');
    refs.sessionChip = document.getElementById('session-chip');
    refs.sessionText = document.getElementById('session-text');
    refs.proxyCount = document.getElementById('proxy-count');
    refs.sourceCount = document.getElementById('source-count');
    refs.ruleCount = document.getElementById('rule-count');
    refs.tokenList = document.getElementById('token-list');
    refs.proxySearch = document.getElementById('proxy-search');
    refs.proxyProtocolFilter = document.getElementById('proxy-protocol-filter');
    refs.proxyList = document.getElementById('proxy-list');
    refs.sourceList = document.getElementById('source-list');
    refs.ruleSetList = document.getElementById('rule-set-list');
    refs.toast = document.getElementById('toast');
    refs.tokenForm = document.getElementById('token-form');
    refs.tokenEditorTitle = document.getElementById('token-editor-title');
    refs.tokenEditorDesc = document.getElementById('token-editor-desc');
    refs.tokenId = document.getElementById('token-id');
    refs.tokenName = document.getElementById('token-name');
    refs.tokenNotes = document.getElementById('token-notes');
    refs.tokenEnabled = document.getElementById('token-enabled');
    refs.tokenPlaintext = document.getElementById('token-plaintext');
    refs.tokenPreview = document.getElementById('token-preview');
    refs.tokenPreviewWrap = document.getElementById('token-preview-wrap');
    refs.tokenScopeAdmin = document.getElementById('token-scope-admin');
    refs.tokenScopeSubscriptionsRead = document.getElementById('token-scope-subscriptions-read');
    refs.tokenScopeProxiesRead = document.getElementById('token-scope-proxies-read');
    refs.tokenScopeProxiesWrite = document.getElementById('token-scope-proxies-write');
    refs.tokenScopeSourcesRead = document.getElementById('token-scope-sources-read');
    refs.tokenScopeSourcesWrite = document.getElementById('token-scope-sources-write');
    refs.tokenScopeRulesRead = document.getElementById('token-scope-rules-read');
    refs.tokenScopeRulesWrite = document.getElementById('token-scope-rules-write');
    refs.tokenScopeTokensRead = document.getElementById('token-scope-tokens-read');
    refs.tokenScopeTokensWrite = document.getElementById('token-scope-tokens-write');
    refs.proxyForm = document.getElementById('proxy-form');
    refs.proxyEditorTitle = document.getElementById('proxy-editor-title');
    refs.proxyEditorDesc = document.getElementById('proxy-editor-desc');
    refs.proxyId = document.getElementById('proxy-id');
    refs.proxyName = document.getElementById('proxy-name');
    refs.proxyPriority = document.getElementById('proxy-priority');
    refs.proxyEnabled = document.getElementById('proxy-enabled');
    refs.proxyTags = document.getElementById('proxy-tags');
    refs.proxyNotes = document.getElementById('proxy-notes');
    refs.proxyUri = document.getElementById('proxy-uri');
    refs.proxyClashOverrides = document.getElementById('proxy-clash-overrides');
    refs.proxyModeButtons = Array.from(document.querySelectorAll('[data-proxy-mode]'));
    refs.proxyUriPanel = document.getElementById('proxy-uri-panel');
    refs.proxyManualPanel = document.getElementById('proxy-manual-panel');
    refs.proxyManualProtocol = document.getElementById('proxy-manual-protocol');
    refs.proxyManualHost = document.getElementById('proxy-manual-host');
    refs.proxyManualPort = document.getElementById('proxy-manual-port');
    refs.proxyManualUuid = document.getElementById('proxy-manual-uuid');
    refs.proxyManualPassword = document.getElementById('proxy-manual-password');
    refs.proxyManualCipher = document.getElementById('proxy-manual-cipher');
    refs.proxyManualAlterId = document.getElementById('proxy-manual-alter-id');
    refs.proxyManualFlow = document.getElementById('proxy-manual-flow');
    refs.proxyManualNetwork = document.getElementById('proxy-manual-network');
    refs.proxyManualSecurity = document.getElementById('proxy-manual-security');
    refs.proxyManualSni = document.getElementById('proxy-manual-sni');
    refs.proxyManualHostHeader = document.getElementById('proxy-manual-host-header');
    refs.proxyManualPath = document.getElementById('proxy-manual-path');
    refs.proxyManualServiceName = document.getElementById('proxy-manual-service-name');
    refs.proxyManualAllowInsecure = document.getElementById('proxy-manual-allow-insecure');
    refs.proxyManualPublicKey = document.getElementById('proxy-manual-public-key');
    refs.proxyManualShortId = document.getElementById('proxy-manual-short-id');
    refs.proxyManualPlugin = document.getElementById('proxy-manual-plugin');
    refs.proxyManualPluginOpts = document.getElementById('proxy-manual-plugin-opts');
    refs.proxyImportUri = document.getElementById('proxy-import-uri');
    refs.proxyUriPreview = document.getElementById('proxy-uri-preview');
    refs.ruleSetForm = document.getElementById('rule-set-form');
    refs.sourceForm = document.getElementById('source-form');
    refs.sourceEditorTitle = document.getElementById('source-editor-title');
    refs.sourceEditorDesc = document.getElementById('source-editor-desc');
    refs.sourceId = document.getElementById('source-id');
    refs.sourceName = document.getElementById('source-name');
    refs.sourceUrl = document.getElementById('source-url');
    refs.sourceFormat = document.getElementById('source-format');
    refs.sourcePriority = document.getElementById('source-priority');
    refs.sourceEnabled = document.getElementById('source-enabled');
    refs.sourceNotes = document.getElementById('source-notes');
    refs.ruleSetEditorTitle = document.getElementById('rule-set-editor-title');
    refs.ruleSetEditorDesc = document.getElementById('rule-set-editor-desc');
    refs.ruleSetId = document.getElementById('rule-set-id');
    refs.ruleSetName = document.getElementById('rule-set-name');
    refs.ruleSetFormat = document.getElementById('rule-set-format');
    refs.ruleSetPriority = document.getElementById('rule-set-priority');
    refs.ruleSetEnabled = document.getElementById('rule-set-enabled');
    refs.ruleSetNotes = document.getElementById('rule-set-notes');
    refs.ruleSetContent = document.getElementById('rule-set-content');
    refs.ruleSetContentWrap = document.getElementById('rule-set-content-wrap');
    refs.ruleLineListWrap = document.getElementById('rule-line-list-wrap');
    refs.ruleLineList = document.getElementById('rule-line-list');
    refs.ruleBuilderCard = document.getElementById('rule-builder-card');
    refs.ruleBuilderType = document.getElementById('rule-builder-type');
    refs.ruleBuilderValue = document.getElementById('rule-builder-value');
    refs.ruleBuilderTarget = document.getElementById('rule-builder-target');
    refs.ruleBuilderTargetCustom = document.getElementById('rule-builder-target-custom');
    refs.ruleBuilderExtra = document.getElementById('rule-builder-extra');
    refs.ruleBuilderAdd = document.getElementById('rule-builder-add');
    refs.linkClash = document.getElementById('subscription-link-clash');
    refs.linkClashInline = document.getElementById('subscription-link-clash-inline');
    refs.linkUriList = document.getElementById('subscription-link-uri-list');
    refs.linkBase64 = document.getElementById('subscription-link-base64');
  }

  function bindEvents() {
    refs.themeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        state.theme = button.getAttribute('data-theme-choice') || 'light';
        persistSettings();
        applyTheme();
      });
    });

    refs.localeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        state.locale = button.getAttribute('data-locale-choice') || 'zh';
        persistSettings();
        applyLocale();
        renderSubscriptionLinks();
        renderProxyList();
        renderSourceList();
        renderRuleSetList();
        updateSessionChip(refs.sessionChip.dataset.kind || 'warn', refs.sessionChip.dataset.key || 'sessionWaiting');
      });
    });

    refs.tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setActiveTab(button.getAttribute('data-tab-button') || 'overview');
      });
    });

    refs.accessForm.addEventListener('submit', (event) => {
      event.preventDefault();
      connect();
    });

    document.getElementById('clear-session-button').addEventListener('click', () => {
      state.adminToken = '';
      state.subscriptionToken = '';
      state.upstreamOverride = '';
      state.managedTokens = [];
      refs.adminToken.value = '';
      refs.subscriptionToken.value = '';
      refs.upstreamOverride.value = '';
      state.proxies = [];
      state.subscriptionSources = [];
      state.ruleSets = [];
      persistSettings();
      renderSubscriptionLinks();
      renderTokenList();
      renderProxyList();
      renderSourceList();
      renderRuleSetList();
      updateSessionChip('warn', 'sessionCleared');
      showToast(t('tokenClearedToast'));
    });

    document.getElementById('new-proxy-button').addEventListener('click', () => {
      resetProxyEditor('manual');
      setActiveTab('nodes');
      scrollToEditor('proxy-editor');
    });

    document.getElementById('reset-proxy-editor').addEventListener('click', () => {
      resetProxyEditor(state.proxyMode);
    });

    document.getElementById('new-rule-set-button').addEventListener('click', () => {
      resetRuleSetEditor();
      setActiveTab('rules');
      scrollToEditor('rule-set-editor');
    });

    document.getElementById('new-source-button').addEventListener('click', () => {
      resetSourceEditor();
      setActiveTab('sources');
      scrollToEditor('source-editor');
    });

    document.getElementById('new-token-button').addEventListener('click', () => {
      resetTokenEditor();
      scrollToEditor('token-editor');
    });

    document.getElementById('reset-source-editor').addEventListener('click', () => {
      resetSourceEditor();
    });

    document.getElementById('reset-token-editor').addEventListener('click', () => {
      resetTokenEditor();
    });

    document.getElementById('generate-token-button').addEventListener('click', () => {
      const plaintext = generatePlaintextToken();
      refs.tokenPlaintext.value = plaintext;
      refs.tokenPreview.textContent = plaintext;
      refs.tokenPreviewWrap.classList.remove('is-hidden');
      showToast(t('tokenGeneratedToast'));
    });

    document.getElementById('reset-rule-set-editor').addEventListener('click', () => {
      resetRuleSetEditor();
    });

    refs.proxySearch.addEventListener('input', renderProxyList);
    refs.proxyProtocolFilter.addEventListener('change', renderProxyList);

    refs.proxyModeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setProxyMode(button.getAttribute('data-proxy-mode') || 'manual');
      });
    });

    refs.proxyImportUri.addEventListener('click', () => {
      const uri = refs.proxyUri.value.trim();
      if (!uri) {
        showToast(t('importUriMissingToast'), true);
        return;
      }
      try {
        applyManualValues(parseManualProxyUri(uri));
        setProxyMode('manual');
        showToast(t('importUriSuccessToast'));
      } catch (error) {
        showToast(readErrorMessage(error), true);
      }
    });

    refs.proxyManualProtocol.addEventListener('change', updateManualVisibility);
    refs.proxyManualNetwork.addEventListener('change', updateManualVisibility);
    refs.proxyManualSecurity.addEventListener('change', updateManualVisibility);

    refs.proxyForm.addEventListener('input', syncManualPreview);
    refs.proxyForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await saveProxy();
    });

    refs.ruleSetForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await saveRuleSet();
    });

    refs.ruleLineList.addEventListener('input', (event) => {
      const input = event.target.closest('[data-rule-line-index]');
      if (!input) {
        return;
      }
      const index = Number(input.getAttribute('data-rule-line-index'));
      state.ruleLineItems[index] = input.value;
    });

    refs.ruleLineList.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove-rule-line]');
      if (!button) {
        return;
      }
      const index = Number(button.getAttribute('data-remove-rule-line'));
      state.ruleLineItems.splice(index, 1);
      renderRuleLineList();
    });

    refs.sourceForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await saveSource();
    });

    refs.tokenForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await saveToken();
    });

    refs.ruleSetFormat.addEventListener('change', updateRuleBuilderVisibility);

    refs.ruleBuilderTarget.addEventListener('change', () => {
      const isCustom = refs.ruleBuilderTarget.value === '__custom__';
      refs.ruleBuilderTargetCustom.classList.toggle('is-hidden', !isCustom);
      if (!isCustom) {
        refs.ruleBuilderTargetCustom.value = '';
      }
    });

    refs.ruleBuilderAdd.addEventListener('click', () => {
      try {
        appendRuleLineFromBuilder();
        showToast(t('ruleBuilderAddedToast'));
      } catch (error) {
        showToast(readErrorMessage(error), true);
      }
    });

    refs.proxyList.addEventListener('click', handleProxyListClick);
    refs.tokenList.addEventListener('click', handleTokenListClick);
    refs.sourceList.addEventListener('click', handleSourceListClick);
    refs.ruleSetList.addEventListener('click', handleRuleSetListClick);

    Array.from(document.querySelectorAll('[data-copy-target]')).forEach((button) => {
      button.addEventListener('click', async () => {
        const target = document.getElementById(button.getAttribute('data-copy-target'));
        const link = target.getAttribute('href') || target.textContent || '';
        if (!target.getAttribute('href')) {
          showToast(t('noLinkToast'), true);
          return;
        }
        try {
          await navigator.clipboard.writeText(link);
          showToast(t('copiedToast'));
        } catch (error) {
          showToast(readErrorMessage(error), true);
        }
      });
    });
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        refs.adminToken.value = state.adminToken;
        refs.subscriptionToken.value = state.subscriptionToken;
        refs.upstreamOverride.value = state.upstreamOverride;
        return;
      }
      const parsed = JSON.parse(raw);
      state.adminToken = parsed.adminToken || '';
      state.subscriptionToken = parsed.subscriptionToken || '';
      state.upstreamOverride = parsed.upstreamOverride || '';
      state.activeTab = parsed.activeTab || 'overview';
      state.locale = parsed.locale || 'zh';
      state.theme = parsed.theme || 'light';
    } catch {
      localStorage.removeItem(storageKey);
    }
    refs.adminToken.value = state.adminToken;
    refs.subscriptionToken.value = state.subscriptionToken;
    refs.upstreamOverride.value = state.upstreamOverride;
  }

  function persistSettings() {
    localStorage.setItem(storageKey, JSON.stringify({
      adminToken: state.adminToken,
      subscriptionToken: state.subscriptionToken,
      upstreamOverride: state.upstreamOverride,
      activeTab: state.activeTab,
      locale: state.locale,
      theme: state.theme
    }));
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    refs.themeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.getAttribute('data-theme-choice') === state.theme);
    });
  }

  function applyLocale() {
    document.documentElement.lang = state.locale === 'zh' ? 'zh-CN' : 'en';
    document.title = t('documentTitle');
    refs.localeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.getAttribute('data-locale-choice') === state.locale);
    });

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      node.setAttribute('placeholder', t(node.getAttribute('data-i18n-placeholder')));
    });
  }

  function setActiveTab(tab) {
    state.activeTab = tab;
    persistSettings();
    refs.tabButtons.forEach((button) => {
      button.classList.toggle('is-active', button.getAttribute('data-tab-button') === tab);
    });
    refs.tabPanels.forEach((panel) => {
      panel.classList.toggle('is-hidden', panel.getAttribute('data-tab-panel') !== tab);
    });
  }

  async function connect() {
    state.adminToken = refs.adminToken.value.trim();
    state.subscriptionToken = refs.subscriptionToken.value.trim();
    state.upstreamOverride = refs.upstreamOverride.value.trim();

    if (!state.adminToken) {
      updateSessionChip('warn', 'sessionWaiting');
      showToast(t('enterAdminTokenToast'), true);
      return;
    }

    persistSettings();
    renderSubscriptionLinks();
    updateSessionChip('warn', 'sessionConnecting');
    try {
      await loadDashboard();
      updateSessionChip('ok', 'sessionConnected');
    } catch (error) {
      updateSessionChip('error', 'sessionFailed');
      showToast(readErrorMessage(error), true);
    }
  }

  async function loadDashboard() {
    const [tokenData, proxyData, sourceData, ruleData] = await Promise.all([
      api('/api/admin/tokens'),
      api('/api/admin/proxies'),
      api('/api/admin/subscription-sources'),
      api('/api/admin/rule-sets')
    ]);
    state.managedTokens = tokenData.data || [];
    state.proxies = proxyData.data || [];
    state.subscriptionSources = sourceData.data || [];
    state.ruleSets = ruleData.data || [];
    refs.proxyCount.textContent = String(state.proxies.length);
    refs.sourceCount.textContent = String(state.subscriptionSources.length);
    refs.ruleCount.textContent = String(state.ruleSets.length);
    renderTokenList();
    renderProxyList();
    renderSourceList();
    renderRuleSetList();
  }

  function renderTokenList() {
    if (!state.managedTokens.length) {
      refs.tokenList.innerHTML = '<div class="empty-state list-card"><h4>' + escapeHtml(t('tokensEmptyTitle')) + '</h4><p>' + escapeHtml(t('tokensEmptyBody')) + '</p></div>';
      return;
    }
    refs.tokenList.innerHTML = state.managedTokens.map((token) => renderTokenCard(token)).join('');
  }

  function renderTokenCard(token) {
    return '<article class="list-card" data-token-id="' + escapeHtml(token.id) + '">' +
      '<div class="list-card-head">' +
        '<div>' +
          '<h4>' + escapeHtml(token.name) + '</h4>' +
          '<p>' + escapeHtml(token.notes || '') + '</p>' +
        '</div>' +
        '<span class="pill ' + (token.enabled ? 'pill--accent' : 'pill--berry') + '">' + escapeHtml(token.enabled ? t('enabledPill') : t('disabledPill')) + '</span>' +
      '</div>' +
      '<div class="pill-row">' + (token.scopes || []).map((scope) => '<span class="pill">' + escapeHtml(scope) + '</span>').join('') + '</div>' +
      '<div class="list-actions" style="margin-top: 12px;">' +
        '<button class="button-secondary" data-action="edit-token" data-id="' + escapeHtml(token.id) + '">' + escapeHtml(t('edit')) + '</button>' +
        '<button class="button-danger" data-action="delete-token" data-id="' + escapeHtml(token.id) + '">' + escapeHtml(t('del')) + '</button>' +
      '</div>' +
    '</article>';
  }

  function renderProxyList() {
    refs.proxyCount.textContent = String(state.proxies.length);
    const filtered = filterProxies();
    if (!filtered.length) {
      refs.proxyList.innerHTML = '<div class="empty-state list-card"><h4>' + escapeHtml(t('nodesEmptyTitle')) + '</h4><p>' + escapeHtml(t('nodesEmptyBody')) + '</p></div>';
      return;
    }

    refs.proxyList.innerHTML = filtered.map((proxy) => renderProxyCard(proxy)).join('');
  }

  function renderRuleSetList() {
    refs.ruleCount.textContent = String(state.ruleSets.length);
    if (!state.ruleSets.length) {
      refs.ruleSetList.innerHTML = '<div class="empty-state list-card"><h4>' + escapeHtml(t('rulesEmptyTitle')) + '</h4><p>' + escapeHtml(t('rulesEmptyBody')) + '</p></div>';
      return;
    }

    refs.ruleSetList.innerHTML = state.ruleSets.map((ruleSet) => renderRuleSetCard(ruleSet)).join('');
  }

  function renderSourceList() {
    refs.sourceCount.textContent = String(state.subscriptionSources.length);
    if (!state.subscriptionSources.length) {
      refs.sourceList.innerHTML = '<div class="empty-state list-card"><h4>' + escapeHtml(t('sourcesEmptyTitle')) + '</h4><p>' + escapeHtml(t('sourcesEmptyBody')) + '</p></div>';
      return;
    }
    refs.sourceList.innerHTML = state.subscriptionSources.map((source) => renderSourceCard(source)).join('');
  }

  function renderSourceCard(source) {
    return '<article class="list-card" data-source-id="' + escapeHtml(source.id) + '">' +
      '<div class="list-card-head">' +
        '<div>' +
          '<h4>' + escapeHtml(source.name) + '</h4>' +
          '<p>' + escapeHtml(source.notes || source.url) + '</p>' +
        '</div>' +
        '<span class="pill pill--accent">' + escapeHtml(source.format) + '</span>' +
      '</div>' +
      '<div class="pill-row" style="margin: 10px 0 12px;">' +
        '<span class="pill">' + escapeHtml(t('priorityShort')) + ' ' + escapeHtml(String(source.priority)) + '</span>' +
        '<span class="pill ' + (source.enabled ? 'pill--accent' : 'pill--berry') + '">' + escapeHtml(source.enabled ? t('enabledPill') : t('disabledPill')) + '</span>' +
      '</div>' +
      '<div class="preview-box" style="margin-top: 0; padding: 12px;"><pre>' + escapeHtml(source.url) + '</pre></div>' +
      '<div class="list-actions" style="margin-top: 12px;">' +
        '<button class="button-secondary" data-action="edit-source" data-id="' + escapeHtml(source.id) + '">' + escapeHtml(t('edit')) + '</button>' +
        '<button class="button-danger" data-action="delete-source" data-id="' + escapeHtml(source.id) + '">' + escapeHtml(t('del')) + '</button>' +
      '</div>' +
    '</article>';
  }

  function renderProxyCard(proxy) {
    const summary = summarizeProxy(proxy.uri);
    const tags = proxy.tags && proxy.tags.length
      ? '<div class="pill-row">' + proxy.tags.map((tag) => '<span class="pill">' + escapeHtml(tag) + '</span>').join('') + '</div>'
      : '';

    return '<article class="list-card" data-proxy-id="' + escapeHtml(proxy.id) + '">' +
      '<div class="list-card-head">' +
        '<div>' +
          '<h4>' + escapeHtml(proxy.name) + '</h4>' +
          '<p>' + escapeHtml(summary) + '</p>' +
        '</div>' +
        '<span class="pill pill--accent">' + escapeHtml(proxy.type.toUpperCase()) + '</span>' +
      '</div>' +
      tags +
      '<div class="pill-row" style="margin: 10px 0 12px;">' +
        '<span class="pill">' + escapeHtml(t('priorityShort')) + ' ' + escapeHtml(String(proxy.priority)) + '</span>' +
        '<span class="pill ' + (proxy.enabled ? 'pill--accent' : 'pill--berry') + '">' + escapeHtml(proxy.enabled ? t('enabledPill') : t('disabledPill')) + '</span>' +
      '</div>' +
      '<div class="preview-box" style="margin-top: 0; padding: 12px;"><pre>' + escapeHtml(proxy.uri) + '</pre></div>' +
      '<div class="list-actions" style="margin-top: 12px;">' +
        '<button class="button-secondary" data-action="edit-proxy" data-id="' + escapeHtml(proxy.id) + '">' + escapeHtml(t('edit')) + '</button>' +
        '<button class="button-ghost" data-action="clone-proxy" data-id="' + escapeHtml(proxy.id) + '">' + escapeHtml(t('clone')) + '</button>' +
        '<button class="button-danger" data-action="delete-proxy" data-id="' + escapeHtml(proxy.id) + '">' + escapeHtml(t('del')) + '</button>' +
      '</div>' +
    '</article>';
  }

  function renderRuleSetCard(ruleSet) {
    const sample = ruleSet.content.length > 160 ? ruleSet.content.slice(0, 160) + '…' : ruleSet.content;

    return '<article class="list-card" data-rule-set-id="' + escapeHtml(ruleSet.id) + '">' +
      '<div class="list-card-head">' +
        '<div>' +
          '<h4>' + escapeHtml(ruleSet.name) + '</h4>' +
          '<p>' + escapeHtml(ruleSet.notes || t('noNotesYet')) + '</p>' +
        '</div>' +
        '<span class="pill pill--accent">' + escapeHtml(ruleSet.format) + '</span>' +
      '</div>' +
      '<div class="pill-row" style="margin: 10px 0 12px;">' +
        '<span class="pill">' + escapeHtml(t('priorityShort')) + ' ' + escapeHtml(String(ruleSet.priority)) + '</span>' +
        '<span class="pill ' + (ruleSet.enabled ? 'pill--accent' : 'pill--berry') + '">' + escapeHtml(ruleSet.enabled ? t('enabledPill') : t('disabledPill')) + '</span>' +
      '</div>' +
      '<div class="preview-box" style="margin-top: 0; padding: 12px;"><pre>' + escapeHtml(sample) + '</pre></div>' +
      '<div class="list-actions" style="margin-top: 12px;">' +
        '<button class="button-secondary" data-action="edit-rule-set" data-id="' + escapeHtml(ruleSet.id) + '">' + escapeHtml(t('edit')) + '</button>' +
        '<button class="button-danger" data-action="delete-rule-set" data-id="' + escapeHtml(ruleSet.id) + '">' + escapeHtml(t('del')) + '</button>' +
      '</div>' +
    '</article>';
  }

  function handleProxyListClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }
    const action = button.getAttribute('data-action');
    const id = button.getAttribute('data-id');
    if (!action || !id) {
      return;
    }
    const proxy = state.proxies.find((item) => item.id === id);
    if (!proxy) {
      return;
    }
    if (action === 'edit-proxy') {
      editProxy(proxy);
      return;
    }
    if (action === 'clone-proxy') {
      cloneProxy(proxy);
      return;
    }
    if (action === 'delete-proxy') {
      deleteProxy(proxy);
    }
  }

  function handleRuleSetListClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }
    const action = button.getAttribute('data-action');
    const id = button.getAttribute('data-id');
    if (!action || !id) {
      return;
    }
    const ruleSet = state.ruleSets.find((item) => item.id === id);
    if (!ruleSet) {
      return;
    }
    if (action === 'edit-rule-set') {
      editRuleSet(ruleSet);
      return;
    }
    if (action === 'delete-rule-set') {
      deleteRuleSet(ruleSet);
    }
  }

  function handleSourceListClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }
    const action = button.getAttribute('data-action');
    const id = button.getAttribute('data-id');
    if (!action || !id) {
      return;
    }
    const source = state.subscriptionSources.find((item) => item.id === id);
    if (!source) {
      return;
    }
    if (action === 'edit-source') {
      editSource(source);
      return;
    }
    if (action === 'delete-source') {
      deleteSource(source);
    }
  }

  function handleTokenListClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }
    const action = button.getAttribute('data-action');
    const id = button.getAttribute('data-id');
    if (!action || !id) {
      return;
    }
    const token = state.managedTokens.find((item) => item.id === id);
    if (!token) {
      return;
    }
    if (action === 'edit-token') {
      editToken(token);
      return;
    }
    if (action === 'delete-token') {
      deleteToken(token);
    }
  }

  function resetProxyEditor(mode) {
    refs.proxyEditorTitle.textContent = t('proxyEditorCreate');
    refs.proxyEditorDesc.textContent = t('proxyEditorDesc');
    refs.proxyId.value = '';
    refs.proxyName.value = '';
    refs.proxyPriority.value = '100';
    refs.proxyEnabled.checked = true;
    refs.proxyTags.value = '';
    refs.proxyNotes.value = '';
    refs.proxyUri.value = '';
    refs.proxyClashOverrides.value = '';
    refs.proxyManualProtocol.value = 'vless';
    refs.proxyManualHost.value = '';
    refs.proxyManualPort.value = '';
    refs.proxyManualUuid.value = '';
    refs.proxyManualPassword.value = '';
    refs.proxyManualCipher.value = 'auto';
    refs.proxyManualAlterId.value = '0';
    refs.proxyManualFlow.value = '';
    refs.proxyManualNetwork.value = 'tcp';
    refs.proxyManualSecurity.value = 'tls';
    refs.proxyManualSni.value = '';
    refs.proxyManualHostHeader.value = '';
    refs.proxyManualPath.value = '';
    refs.proxyManualServiceName.value = '';
    refs.proxyManualAllowInsecure.checked = false;
    refs.proxyManualPublicKey.value = '';
    refs.proxyManualShortId.value = '';
    refs.proxyManualPlugin.value = '';
    refs.proxyManualPluginOpts.value = '';
    state.editingProxyId = null;
    setProxyMode(mode || 'manual');
    updateManualVisibility();
    syncManualPreview();
  }

  function editProxy(proxy) {
    refs.proxyEditorTitle.textContent = t('proxyEditorEdit');
    refs.proxyEditorDesc.textContent = t('proxyEditorDesc');
    refs.proxyId.value = proxy.id;
    refs.proxyName.value = proxy.name;
    refs.proxyPriority.value = String(proxy.priority);
    refs.proxyEnabled.checked = proxy.enabled;
    refs.proxyTags.value = (proxy.tags || []).join(', ');
    refs.proxyNotes.value = proxy.notes || '';
    refs.proxyUri.value = proxy.uri;
    refs.proxyClashOverrides.value = proxy.clashOverrides ? JSON.stringify(proxy.clashOverrides, null, 2) : '';
    state.editingProxyId = proxy.id;
    try {
      applyManualValues(parseManualProxyUri(proxy.uri));
      setProxyMode('manual');
    } catch {
      setProxyMode('uri');
    }
    updateManualVisibility();
    syncManualPreview();
    setActiveTab('nodes');
    scrollToEditor('proxy-editor');
  }

  function cloneProxy(proxy) {
    resetProxyEditor('manual');
    refs.proxyName.value = proxy.name + '-copy';
    refs.proxyPriority.value = String(proxy.priority);
    refs.proxyEnabled.checked = proxy.enabled;
    refs.proxyTags.value = (proxy.tags || []).join(', ');
    refs.proxyNotes.value = proxy.notes || '';
    refs.proxyUri.value = proxy.uri;
    refs.proxyClashOverrides.value = proxy.clashOverrides ? JSON.stringify(proxy.clashOverrides, null, 2) : '';
    try {
      applyManualValues(parseManualProxyUri(proxy.uri));
      setProxyMode('manual');
    } catch {
      setProxyMode('uri');
    }
    updateManualVisibility();
    syncManualPreview();
    setActiveTab('nodes');
    scrollToEditor('proxy-editor');
    showToast(t('cloneProxyToast'));
  }

  function applyManualValues(values) {
    refs.proxyManualProtocol.value = values.protocol || 'vless';
    refs.proxyManualHost.value = values.host || '';
    refs.proxyManualPort.value = values.port || '';
    refs.proxyManualUuid.value = values.uuid || '';
    refs.proxyManualPassword.value = values.password || '';
    refs.proxyManualCipher.value = values.cipher || 'auto';
    refs.proxyManualAlterId.value = values.alterId || '0';
    refs.proxyManualFlow.value = values.flow || '';
    refs.proxyManualNetwork.value = values.network || 'tcp';
    refs.proxyManualSecurity.value = values.security || (values.protocol === 'vmess' ? 'none' : 'tls');
    refs.proxyManualSni.value = values.sni || '';
    refs.proxyManualHostHeader.value = values.hostHeader || '';
    refs.proxyManualPath.value = values.path || '';
    refs.proxyManualServiceName.value = values.serviceName || '';
    refs.proxyManualAllowInsecure.checked = Boolean(values.allowInsecure);
    refs.proxyManualPublicKey.value = values.publicKey || '';
    refs.proxyManualShortId.value = values.shortId || '';
    refs.proxyManualPlugin.value = values.plugin || '';
    refs.proxyManualPluginOpts.value = values.pluginOpts || '';
  }

  function setProxyMode(mode) {
    state.proxyMode = mode === 'uri' ? 'uri' : 'manual';
    refs.proxyModeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.getAttribute('data-proxy-mode') === state.proxyMode);
    });
    refs.proxyUriPanel.classList.toggle('is-hidden', state.proxyMode !== 'uri');
    refs.proxyManualPanel.classList.toggle('is-hidden', state.proxyMode !== 'manual');
    syncManualPreview();
  }

  function updateManualVisibility() {
    const protocol = refs.proxyManualProtocol.value;
    const network = refs.proxyManualNetwork.value;
    const security = refs.proxyManualSecurity.value;

    Array.from(document.querySelectorAll('.protocol-only')).forEach((node) => {
      const protocols = (node.getAttribute('data-protocols') || '').split(' ').filter(Boolean);
      node.classList.toggle('is-hidden', protocols.length > 0 && protocols.indexOf(protocol) === -1);
    });

    Array.from(document.querySelectorAll('.network-only')).forEach((node) => {
      const networks = (node.getAttribute('data-networks') || '').split(' ').filter(Boolean);
      node.classList.toggle('is-hidden', networks.length > 0 && networks.indexOf(network) === -1);
    });

    Array.from(document.querySelectorAll('.security-only')).forEach((node) => {
      const values = (node.getAttribute('data-security-values') || '').split(' ').filter(Boolean);
      node.classList.toggle('is-hidden', values.length > 0 && values.indexOf(security) === -1);
    });

    syncManualPreview();
  }

  function syncManualPreview() {
    if (state.proxyMode === 'uri') {
      refs.proxyUriPreview.textContent = refs.proxyUri.value.trim() || t('loginFirstLink');
      return;
    }
    try {
      refs.proxyUriPreview.textContent = createUriFromManual();
    } catch (error) {
      refs.proxyUriPreview.textContent = t('waitingFields') + readErrorMessage(error);
    }
  }

  async function saveProxy() {
    try {
      const payload = collectProxyPayload();
      const id = refs.proxyId.value.trim();
      if (id) {
        await api('/api/admin/proxies/' + encodeURIComponent(id), {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast(t('proxyUpdatedToast'));
      } else {
        await api('/api/admin/proxies', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast(t('proxyCreatedToast'));
      }
      await loadDashboard();
      resetProxyEditor(state.proxyMode);
    } catch (error) {
      showToast(readErrorMessage(error), true);
    }
  }

  async function deleteProxy(proxy) {
    if (!confirm(interpolate('deleteProxyConfirm', { name: proxy.name }))) {
      return;
    }
    try {
      await api('/api/admin/proxies/' + encodeURIComponent(proxy.id), { method: 'DELETE' });
      if (state.editingProxyId === proxy.id) {
        resetProxyEditor('manual');
      }
      await loadDashboard();
      showToast(t('proxyDeletedToast'));
    } catch (error) {
      showToast(readErrorMessage(error), true);
    }
  }

  function collectProxyPayload() {
    const name = requiredValue(refs.proxyName.value, 'fieldNodeName');
    const uri = state.proxyMode === 'uri' ? requiredValue(refs.proxyUri.value, 'fieldUri') : createUriFromManual();
    let clashOverrides = null;
    const overridesText = refs.proxyClashOverrides.value.trim();
    if (overridesText) {
      const parsed = JSON.parse(overridesText);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error(t('invalidOverrides'));
      }
      clashOverrides = parsed;
    }

    return {
      name: name,
      uri: uri,
      priority: Number(refs.proxyPriority.value || '100'),
      enabled: refs.proxyEnabled.checked,
      tags: refs.proxyTags.value.split(',').map((item) => item.trim()).filter(Boolean),
      notes: refs.proxyNotes.value.trim() || null,
      clashOverrides: clashOverrides
    };
  }

  function createUriFromManual() {
    const protocol = refs.proxyManualProtocol.value;
    const host = requiredValue(refs.proxyManualHost.value, 'fieldHost');
    const port = requiredValue(refs.proxyManualPort.value, 'fieldPort');
    const name = requiredValue(refs.proxyName.value, 'fieldNodeName');
    const network = refs.proxyManualNetwork.value || 'tcp';
    const security = refs.proxyManualSecurity.value || 'none';
    const params = new URLSearchParams();

    if (protocol === 'ss') {
      const cipher = requiredValue(refs.proxyManualCipher.value, 'fieldCipher');
      const password = requiredValue(refs.proxyManualPassword.value, 'fieldPassword');
      const plugin = refs.proxyManualPlugin.value.trim();
      const pluginOpts = refs.proxyManualPluginOpts.value.trim();
      if (plugin) {
        params.set('plugin', plugin + (pluginOpts ? ';' + pluginOpts : ''));
      }
      const uri = 'ss://' + toBase64Utf8(cipher + ':' + password) + '@' + host + ':' + port;
      return appendUriParts(uri, params, name);
    }

    if (protocol === 'vmess') {
      const uuid = requiredValue(refs.proxyManualUuid.value, 'fieldUuid');
      const payload = {
        v: '2',
        ps: name,
        add: host,
        port: String(port),
        id: uuid,
        aid: String(Number(refs.proxyManualAlterId.value || '0')),
        scy: refs.proxyManualCipher.value.trim() || 'auto',
        net: network,
        type: 'none',
        host: refs.proxyManualHostHeader.value.trim(),
        path: network === 'grpc' ? (refs.proxyManualServiceName.value.trim() || '') : (refs.proxyManualPath.value.trim() || ''),
        tls: security === 'tls' ? 'tls' : '',
        sni: refs.proxyManualSni.value.trim(),
        serviceName: refs.proxyManualServiceName.value.trim()
      };
      return 'vmess://' + toBase64Utf8(JSON.stringify(payload));
    }

    if (protocol === 'vless') {
      const uuid = requiredValue(refs.proxyManualUuid.value, 'fieldUuid');
      if (security !== 'none') {
        params.set('security', security);
      }
      applyTransportParams(params, network);
      const flow = refs.proxyManualFlow.value.trim();
      if (flow) {
        params.set('flow', flow);
      }
      if (refs.proxyManualAllowInsecure.checked) {
        params.set('allowInsecure', 'true');
      }
      if (security === 'reality') {
        params.set('pbk', requiredValue(refs.proxyManualPublicKey.value, 'fieldRealityPublicKey'));
        const shortId = refs.proxyManualShortId.value.trim();
        if (shortId) {
          params.set('sid', shortId);
        }
      }
      return appendUriParts('vless://' + encodeURIComponent(uuid) + '@' + host + ':' + port, params, name);
    }

    const password = requiredValue(refs.proxyManualPassword.value, 'fieldPassword');
    if (security !== 'none') {
      params.set('security', security);
    }
    applyTransportParams(params, network);
    if (refs.proxyManualAllowInsecure.checked) {
      params.set('allowInsecure', 'true');
    }
    return appendUriParts('trojan://' + encodeURIComponent(password) + '@' + host + ':' + port, params, name);
  }

  function applyTransportParams(params, network) {
    if (network && network !== 'tcp') {
      params.set('type', network);
    }
    const sni = refs.proxyManualSni.value.trim();
    const hostHeader = refs.proxyManualHostHeader.value.trim();
    const path = refs.proxyManualPath.value.trim();
    const serviceName = refs.proxyManualServiceName.value.trim();
    if (sni) {
      params.set('sni', sni);
    }
    if (hostHeader) {
      params.set('host', hostHeader);
    }
    if ((network === 'ws' || network === 'http' || network === 'h2') && path) {
      params.set('path', path);
    }
    if (network === 'grpc' && serviceName) {
      params.set('serviceName', serviceName);
    }
  }

  function appendUriParts(uri, params, name) {
    const query = params.toString();
    return uri + (query ? '?' + query : '') + '#' + encodeURIComponent(name);
  }

  function parseManualProxyUri(uri) {
    const protocol = uri.split('://')[0].toLowerCase();
    if (protocol === 'ss') {
      return parseShadowsocksUri(uri);
    }
    if (protocol === 'vmess') {
      return parseVmessUri(uri);
    }
    if (protocol === 'vless') {
      return parseVlessUri(uri);
    }
    if (protocol === 'trojan') {
      return parseTrojanUri(uri);
    }
    throw new Error(t('unsupportedProtocol') + protocol);
  }

  function parseShadowsocksUri(uri) {
    const remainder = uri.slice('ss://'.length);
    const hashParts = splitOnce(remainder, '#');
    const queryParts = splitOnce(hashParts[0], '?');
    const mainPart = queryParts[0];
    let credentials = '';
    let serverPart = '';
    if (mainPart.indexOf('@') !== -1) {
      const atIndex = mainPart.lastIndexOf('@');
      credentials = tryDecodeBase64(mainPart.slice(0, atIndex));
      serverPart = mainPart.slice(atIndex + 1);
    } else {
      const decoded = fromBase64Utf8(mainPart);
      const decodedParts = splitOnce(decoded, '@');
      credentials = decodedParts[0];
      serverPart = decodedParts[1];
    }
    const authParts = splitOnce(credentials, ':');
    const hostParts = splitHostPort(serverPart);
    const params = new URLSearchParams(queryParts[1]);
    let plugin = '';
    let pluginOpts = '';
    if (params.has('plugin')) {
      const pluginParts = splitOnce(params.get('plugin'), ';');
      plugin = pluginParts[0] || '';
      pluginOpts = pluginParts[1] || '';
    }
    return {
      protocol: 'ss',
      host: hostParts.host,
      port: hostParts.port,
      cipher: authParts[0],
      password: authParts[1],
      plugin: plugin,
      pluginOpts: pluginOpts,
      network: 'tcp',
      security: 'none'
    };
  }

  function parseVmessUri(uri) {
    const payload = JSON.parse(fromBase64Utf8(uri.slice('vmess://'.length)));
    return {
      protocol: 'vmess',
      host: payload.add || '',
      port: String(payload.port || ''),
      uuid: payload.id || '',
      alterId: String(payload.aid || '0'),
      cipher: payload.scy || 'auto',
      network: payload.net || 'tcp',
      security: payload.tls === 'tls' || payload.tls === '1' ? 'tls' : 'none',
      sni: payload.sni || '',
      hostHeader: payload.host || '',
      path: payload.net === 'grpc' ? '' : (payload.path || ''),
      serviceName: payload.serviceName || (payload.net === 'grpc' ? (payload.path || '') : '')
    };
  }

  function parseVlessUri(uri) {
    const url = new URL(uri);
    return {
      protocol: 'vless',
      host: url.hostname,
      port: url.port || '443',
      uuid: decodeURIComponent(url.username),
      flow: url.searchParams.get('flow') || '',
      network: url.searchParams.get('type') || 'tcp',
      security: url.searchParams.get('security') || 'none',
      sni: url.searchParams.get('sni') || '',
      hostHeader: url.searchParams.get('host') || '',
      path: decodeURIComponent(url.searchParams.get('path') || ''),
      serviceName: url.searchParams.get('serviceName') || '',
      allowInsecure: url.searchParams.get('allowInsecure') === 'true' || url.searchParams.get('allowInsecure') === '1',
      publicKey: url.searchParams.get('pbk') || '',
      shortId: url.searchParams.get('sid') || ''
    };
  }

  function parseTrojanUri(uri) {
    const url = new URL(uri);
    return {
      protocol: 'trojan',
      host: url.hostname,
      port: url.port || '443',
      password: decodeURIComponent(url.username),
      network: url.searchParams.get('type') || 'tcp',
      security: url.searchParams.get('security') || 'tls',
      sni: url.searchParams.get('sni') || '',
      hostHeader: url.searchParams.get('host') || '',
      path: decodeURIComponent(url.searchParams.get('path') || ''),
      serviceName: url.searchParams.get('serviceName') || '',
      allowInsecure: url.searchParams.get('allowInsecure') === 'true' || url.searchParams.get('allowInsecure') === '1'
    };
  }

  function splitOnce(value, separator) {
    const index = value.indexOf(separator);
    if (index === -1) {
      return [value, ''];
    }
    return [value.slice(0, index), value.slice(index + separator.length)];
  }

  function splitHostPort(value) {
    const index = value.lastIndexOf(':');
    if (index === -1) {
      throw new Error(t('invalidUri'));
    }
    return { host: value.slice(0, index), port: value.slice(index + 1) };
  }

  function summarizeProxy(uri) {
    try {
      const parsed = parseManualProxyUri(uri);
      return parsed.host + ':' + parsed.port + ' · ' + parsed.protocol.toUpperCase() + (parsed.network ? ' · ' + parsed.network : '');
    } catch {
      return t('summaryRaw');
    }
  }

  function filterProxies() {
    const query = refs.proxySearch.value.trim().toLowerCase();
    const protocol = refs.proxyProtocolFilter.value;
    return state.proxies.filter((proxy) => {
      if (protocol && protocol !== 'all' && proxy.type !== protocol) {
        return false;
      }
      if (!query) {
        return true;
      }
      const haystack = [
        proxy.name,
        proxy.type,
        proxy.uri,
        proxy.notes || '',
        ...(proxy.tags || [])
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }

  function resetRuleSetEditor() {
    refs.ruleSetEditorTitle.textContent = t('ruleEditorCreate');
    refs.ruleSetEditorDesc.textContent = t('ruleEditorDesc');
    refs.ruleSetId.value = '';
    refs.ruleSetName.value = '';
    refs.ruleSetFormat.value = 'rule-lines';
    refs.ruleSetPriority.value = '100';
    refs.ruleSetEnabled.checked = true;
    refs.ruleSetNotes.value = '';
    refs.ruleSetContent.value = '';
    state.ruleLineItems = [];
    refs.ruleBuilderType.value = 'DOMAIN-SUFFIX';
    refs.ruleBuilderValue.value = '';
    refs.ruleBuilderTarget.value = 'Proxy';
    refs.ruleBuilderTargetCustom.value = '';
    refs.ruleBuilderTargetCustom.classList.add('is-hidden');
    refs.ruleBuilderExtra.value = '';
    state.editingRuleSetId = null;
    updateRuleBuilderVisibility();
  }

  function resetSourceEditor() {
    refs.sourceEditorTitle.textContent = t('sourceEditorCreate');
    refs.sourceEditorDesc.textContent = t('sourceEditorDesc');
    refs.sourceId.value = '';
    refs.sourceName.value = '';
    refs.sourceUrl.value = '';
    refs.sourceFormat.value = 'auto';
    refs.sourcePriority.value = '100';
    refs.sourceEnabled.checked = true;
    refs.sourceNotes.value = '';
    state.editingSourceId = null;
  }

  function resetTokenEditor() {
    refs.tokenEditorTitle.textContent = t('tokenEditorCreate');
    refs.tokenEditorDesc.textContent = t('tokenEditorDesc');
    refs.tokenId.value = '';
    refs.tokenName.value = '';
    refs.tokenNotes.value = '';
    refs.tokenEnabled.checked = true;
    refs.tokenPlaintext.value = '';
    refs.tokenPreview.textContent = '';
    refs.tokenPreviewWrap.classList.add('is-hidden');
    setTokenScopeValues([]);
    state.editingManagedTokenId = null;
  }

  function editToken(token) {
    refs.tokenEditorTitle.textContent = t('tokenEditorEdit');
    refs.tokenEditorDesc.textContent = t('tokenEditorDesc');
    refs.tokenId.value = token.id;
    refs.tokenName.value = token.name;
    refs.tokenNotes.value = token.notes || '';
    refs.tokenEnabled.checked = token.enabled;
    refs.tokenPlaintext.value = '';
    refs.tokenPreview.textContent = '';
    refs.tokenPreviewWrap.classList.add('is-hidden');
    setTokenScopeValues(token.scopes || []);
    state.editingManagedTokenId = token.id;
    scrollToEditor('token-editor');
  }

  function setTokenScopeValues(scopes) {
    const set = new Set(scopes || []);
    refs.tokenScopeAdmin.checked = set.has('admin:*');
    refs.tokenScopeSubscriptionsRead.checked = set.has('subscriptions:read');
    refs.tokenScopeProxiesRead.checked = set.has('proxies:read');
    refs.tokenScopeProxiesWrite.checked = set.has('proxies:write');
    refs.tokenScopeSourcesRead.checked = set.has('sources:read');
    refs.tokenScopeSourcesWrite.checked = set.has('sources:write');
    refs.tokenScopeRulesRead.checked = set.has('rules:read');
    refs.tokenScopeRulesWrite.checked = set.has('rules:write');
    refs.tokenScopeTokensRead.checked = set.has('tokens:read');
    refs.tokenScopeTokensWrite.checked = set.has('tokens:write');
  }

  function collectTokenScopes() {
    const scopes = [];
    if (refs.tokenScopeAdmin.checked) scopes.push('admin:*');
    if (refs.tokenScopeSubscriptionsRead.checked) scopes.push('subscriptions:read');
    if (refs.tokenScopeProxiesRead.checked) scopes.push('proxies:read');
    if (refs.tokenScopeProxiesWrite.checked) scopes.push('proxies:write');
    if (refs.tokenScopeSourcesRead.checked) scopes.push('sources:read');
    if (refs.tokenScopeSourcesWrite.checked) scopes.push('sources:write');
    if (refs.tokenScopeRulesRead.checked) scopes.push('rules:read');
    if (refs.tokenScopeRulesWrite.checked) scopes.push('rules:write');
    if (refs.tokenScopeTokensRead.checked) scopes.push('tokens:read');
    if (refs.tokenScopeTokensWrite.checked) scopes.push('tokens:write');
    return scopes;
  }

  function editSource(source) {
    refs.sourceEditorTitle.textContent = t('sourceEditorEdit');
    refs.sourceEditorDesc.textContent = t('sourceEditorDesc');
    refs.sourceId.value = source.id;
    refs.sourceName.value = source.name;
    refs.sourceUrl.value = source.url;
    refs.sourceFormat.value = source.format;
    refs.sourcePriority.value = String(source.priority);
    refs.sourceEnabled.checked = source.enabled;
    refs.sourceNotes.value = source.notes || '';
    state.editingSourceId = source.id;
    setActiveTab('sources');
    scrollToEditor('source-editor');
  }

  function editRuleSet(ruleSet) {
    refs.ruleSetEditorTitle.textContent = t('ruleEditorEdit');
    refs.ruleSetEditorDesc.textContent = t('ruleEditorDesc');
    refs.ruleSetId.value = ruleSet.id;
    refs.ruleSetName.value = ruleSet.name;
    refs.ruleSetFormat.value = ruleSet.format;
    refs.ruleSetPriority.value = String(ruleSet.priority);
    refs.ruleSetEnabled.checked = ruleSet.enabled;
    refs.ruleSetNotes.value = ruleSet.notes || '';
    refs.ruleSetContent.value = ruleSet.content;
    state.ruleLineItems = ruleSet.format === 'rule-lines'
      ? ruleSet.content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      : [];
    state.editingRuleSetId = ruleSet.id;
    updateRuleBuilderVisibility();
    setActiveTab('rules');
    scrollToEditor('rule-set-editor');
  }

  function updateRuleBuilderVisibility() {
    const isRuleLines = refs.ruleSetFormat.value === 'rule-lines';
    refs.ruleBuilderCard.classList.toggle('is-hidden', !isRuleLines);
    refs.ruleLineListWrap.classList.toggle('is-hidden', !isRuleLines);
    refs.ruleSetContentWrap.classList.toggle('is-hidden', isRuleLines);
    renderRuleLineList();
  }

  function appendRuleLineFromBuilder() {
    const type = refs.ruleBuilderType.value;
    const target = refs.ruleBuilderTarget.value === '__custom__'
      ? requiredValue(refs.ruleBuilderTargetCustom.value, 'ruleTargetCustomLabel')
      : refs.ruleBuilderTarget.value;
    const extra = refs.ruleBuilderExtra.value;
    let line = '';

    if (type === 'MATCH' || type === 'FINAL') {
      line = type + ',' + target;
    } else {
      const value = requiredValue(refs.ruleBuilderValue.value, 'ruleValueLabel');
      line = type + ',' + value + ',' + target;
      if (extra) {
        line += ',' + extra;
      }
    }

    state.ruleLineItems.push(line);
    renderRuleLineList();
    refs.ruleBuilderValue.value = '';
    refs.ruleBuilderExtra.value = '';
  }

  function renderRuleLineList() {
    if (refs.ruleSetFormat.value !== 'rule-lines') {
      return;
    }
    if (!state.ruleLineItems.length) {
      refs.ruleLineList.innerHTML = '<div class="empty-state list-card"><h4>' + escapeHtml(t('rulesEmptyTitle')) + '</h4><p>' + escapeHtml(t('ruleBuilderHelper')) + '</p></div>';
      return;
    }
    refs.ruleLineList.innerHTML = state.ruleLineItems.map((line, index) => (
      '<div class="line-row">' +
        '<input type="text" data-rule-line-index="' + String(index) + '" value="' + escapeHtml(line) + '" />' +
        '<button class="button-danger" type="button" data-remove-rule-line="' + String(index) + '">' + escapeHtml(t('del')) + '</button>' +
      '</div>'
    )).join('');
  }

  async function saveRuleSet() {
    try {
      const content = refs.ruleSetFormat.value === 'rule-lines'
        ? state.ruleLineItems.map((line) => line.trim()).filter(Boolean).join('\n')
        : refs.ruleSetContent.value;
      const payload = {
        name: requiredValue(refs.ruleSetName.value, 'fieldRuleName'),
        format: refs.ruleSetFormat.value,
        content: requiredValue(content, 'fieldRuleContent'),
        priority: Number(refs.ruleSetPriority.value || '100'),
        enabled: refs.ruleSetEnabled.checked,
        notes: refs.ruleSetNotes.value.trim() || null
      };
      const id = refs.ruleSetId.value.trim();
      if (id) {
        await api('/api/admin/rule-sets/' + encodeURIComponent(id), {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast(t('ruleUpdatedToast'));
      } else {
        await api('/api/admin/rule-sets', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast(t('ruleCreatedToast'));
      }
      await loadDashboard();
      resetRuleSetEditor();
    } catch (error) {
      showToast(readErrorMessage(error), true);
    }
  }

  async function saveSource() {
    try {
      const payload = {
        name: requiredValue(refs.sourceName.value, 'fieldSourceName'),
        url: requiredValue(refs.sourceUrl.value, 'fieldSourceUrl'),
        format: refs.sourceFormat.value,
        priority: Number(refs.sourcePriority.value || '100'),
        enabled: refs.sourceEnabled.checked,
        notes: refs.sourceNotes.value.trim() || null
      };
      const id = refs.sourceId.value.trim();
      if (id) {
        await api('/api/admin/subscription-sources/' + encodeURIComponent(id), {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast(t('sourceUpdatedToast'));
      } else {
        await api('/api/admin/subscription-sources', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast(t('sourceCreatedToast'));
      }
      await loadDashboard();
      resetSourceEditor();
    } catch (error) {
      showToast(readErrorMessage(error), true);
    }
  }

  async function deleteRuleSet(ruleSet) {
    if (!confirm(interpolate('deleteRuleConfirm', { name: ruleSet.name }))) {
      return;
    }
    try {
      await api('/api/admin/rule-sets/' + encodeURIComponent(ruleSet.id), { method: 'DELETE' });
      if (state.editingRuleSetId === ruleSet.id) {
        resetRuleSetEditor();
      }
      await loadDashboard();
      showToast(t('ruleDeletedToast'));
    } catch (error) {
      showToast(readErrorMessage(error), true);
    }
  }

  async function deleteSource(source) {
    if (!confirm(interpolate('deleteSourceConfirm', { name: source.name }))) {
      return;
    }
    try {
      await api('/api/admin/subscription-sources/' + encodeURIComponent(source.id), { method: 'DELETE' });
      if (state.editingSourceId === source.id) {
        resetSourceEditor();
      }
      await loadDashboard();
      showToast(t('sourceDeletedToast'));
    } catch (error) {
      showToast(readErrorMessage(error), true);
    }
  }

  async function saveToken() {
    try {
      const plaintext = refs.tokenPlaintext.value.trim();
      const scopes = collectTokenScopes();
      if (!scopes.length) {
        throw new Error(t('tokenScopesLabel'));
      }
      const payload = {
        name: requiredValue(refs.tokenName.value, 'fieldTokenName'),
        scopes,
        enabled: refs.tokenEnabled.checked,
        notes: refs.tokenNotes.value.trim() || null
      };
      const id = refs.tokenId.value.trim();
      if (!id && !plaintext) {
        throw new Error(t('tokenPlaintextHint'));
      }
      if (plaintext) {
        payload.tokenSha256 = await sha256Hex(plaintext);
      }

      if (id) {
        await api('/api/admin/tokens/' + encodeURIComponent(id), {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast(t('tokenUpdatedToast'));
      } else {
        await api('/api/admin/tokens', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast(t('tokenCreatedToast'));
      }
      await loadDashboard();
      resetTokenEditor();
    } catch (error) {
      showToast(readErrorMessage(error), true);
    }
  }

  async function deleteToken(token) {
    if (!confirm(interpolate('deleteTokenConfirm', { name: token.name }))) {
      return;
    }
    try {
      await api('/api/admin/tokens/' + encodeURIComponent(token.id), { method: 'DELETE' });
      if (state.editingManagedTokenId === token.id) {
        resetTokenEditor();
      }
      await loadDashboard();
      showToast(t('tokenDeletedToast'));
    } catch (error) {
      showToast(readErrorMessage(error), true);
    }
  }

  function renderSubscriptionLinks() {
    const token = state.subscriptionToken || state.adminToken;
    const upstream = refs.upstreamOverride.value.trim() || state.upstreamOverride;
    const empty = t('loginFirstLink');
    const links = {
      clash: token ? buildSubscriptionLink('/api/subscription/clash', token, upstream) : empty,
      clashInline: token ? buildSubscriptionLink('/api/subscription/clash-inline', token, upstream) : empty,
      uriList: token ? buildSubscriptionLink('/api/subscription/uri-list', token, upstream) : empty,
      base64: token ? buildSubscriptionLink('/api/subscription/base64', token, upstream) : empty
    };
    setLink(refs.linkClash, links.clash, empty);
    setLink(refs.linkClashInline, links.clashInline, empty);
    setLink(refs.linkUriList, links.uriList, empty);
    setLink(refs.linkBase64, links.base64, empty);
  }

  function setLink(element, value, emptyValue) {
    if (value === emptyValue) {
      element.textContent = emptyValue;
      element.removeAttribute('href');
      return;
    }
    element.textContent = value;
    element.setAttribute('href', value);
  }

  function buildSubscriptionLink(path, token, upstream) {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('token', token);
    if (upstream) {
      url.searchParams.set('upstream', upstream);
    }
    return url.toString();
  }

  function updateSessionChip(kind, key) {
    refs.sessionChip.dataset.kind = kind;
    refs.sessionChip.dataset.key = key;
    refs.sessionChip.className = 'status-chip ' + kind;
    refs.sessionChip.textContent = t(key);
    refs.sessionText.textContent = kind === 'ok'
      ? t('sessionMetaConnected')
      : kind === 'error'
        ? t('sessionMetaFailed')
        : t('sessionMetaIdle');
  }

  async function api(path, options) {
    const requestOptions = options || {};
    const headers = new Headers(requestOptions.headers || {});
    headers.set('Authorization', 'Bearer ' + state.adminToken);
    if (requestOptions.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(path, {
      method: requestOptions.method || 'GET',
      headers: headers,
      body: requestOptions.body
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.indexOf('application/json') !== -1
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (payload && payload.error) {
        throw new Error(payload.error.message + (payload.error.details ? ': ' + JSON.stringify(payload.error.details) : ''));
      }
      throw new Error(typeof payload === 'string' ? payload : 'Request failed with status ' + response.status);
    }
    return payload;
  }

  function requiredValue(value, fieldKey) {
    const trimmed = String(value || '').trim();
    if (!trimmed) {
      throw new Error(t(fieldKey));
    }
    return trimmed;
  }

  function toBase64Utf8(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  async function sha256Hex(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function generatePlaintextToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function fromBase64Utf8(value) {
    const normalized = normalizeBase64(value);
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function tryDecodeBase64(value) {
    try {
      return fromBase64Utf8(value);
    } catch {
      return value;
    }
  }

  function normalizeBase64(value) {
    const cleaned = String(value || '').replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
    const remainder = cleaned.length % 4;
    return remainder === 0 ? cleaned : cleaned + '='.repeat(4 - remainder);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function interpolate(key, params) {
    let text = t(key);
    Object.keys(params || {}).forEach((name) => {
      text = text.replace('{' + name + '}', String(params[name]));
    });
    return text;
  }

  function t(key) {
    const language = translations[state.locale] || translations.zh;
    return language[key] || translations.en[key] || key;
  }

  function readErrorMessage(error) {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  function showToast(message, isError) {
    refs.toast.textContent = message;
    refs.toast.classList.add('is-visible');
    refs.toast.classList.toggle('is-error', Boolean(isError));
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      refs.toast.classList.remove('is-visible');
    }, 3200);
  }

  function scrollToEditor(id) {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    window.scrollTo({ top: target.offsetTop - 18, behavior: 'smooth' });
  }
})();
`;

export function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Subscription Atelier</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>${adminStyles}</style>
  </head>
  <body>
    <div class="shell">
      <header class="hero">
        <div>
          <p class="eyebrow" data-i18n="eyebrow"></p>
          <h1 data-i18n="heroTitle"></h1>
          <p data-i18n="heroBody"></p>
        </div>
        <aside class="hero-status">
          <div class="status-chip warn" id="session-chip"></div>
          <div class="status-meta" id="session-text"></div>
        </aside>
      </header>

      <div class="topbar">
        <div class="control-cluster">
          <span class="cluster-label" data-i18n="controlLanguage"></span>
          <div class="segment">
            <button type="button" data-locale-choice="zh" data-i18n="languageZh"></button>
            <button type="button" data-locale-choice="en" data-i18n="languageEn"></button>
          </div>
        </div>
        <div class="control-cluster">
          <span class="cluster-label" data-i18n="controlTheme"></span>
          <div class="segment">
            <button type="button" data-theme-choice="light" data-i18n="themeLight"></button>
            <button type="button" data-theme-choice="dark" data-i18n="themeDark"></button>
          </div>
        </div>
      </div>

      <nav class="tabs">
        <button class="tab-button" type="button" data-tab-button="overview" data-i18n="tabOverview"></button>
        <button class="tab-button" type="button" data-tab-button="nodes" data-i18n="tabNodes"></button>
        <button class="tab-button" type="button" data-tab-button="sources" data-i18n="tabSources"></button>
        <button class="tab-button" type="button" data-tab-button="rules" data-i18n="tabRules"></button>
      </nav>

      <main>
        <section class="tab-panel" data-tab-panel="overview">
          <div class="overview-grid">
            <section class="panel pad">
              <div class="section-head">
                <div>
                  <h2 data-i18n="accessTitle"></h2>
                  <p data-i18n="accessDesc"></p>
                </div>
                <div class="pill-row">
                  <span class="pill"><span data-i18n="tabNodes"></span> <strong id="proxy-count" style="margin-left: 6px;">0</strong></span>
                  <span class="pill"><span data-i18n="tabSources"></span> <strong id="source-count" style="margin-left: 6px;">0</strong></span>
                  <span class="pill"><span data-i18n="tabRules"></span> <strong id="rule-count" style="margin-left: 6px;">0</strong></span>
                </div>
              </div>
              <form id="access-form">
                <div class="grid-three">
                  <div class="field">
                    <label for="admin-token" data-i18n="adminTokenLabel"></label>
                    <input id="admin-token" type="password" autocomplete="off" />
                    <div class="hint" data-i18n="adminTokenHint"></div>
                  </div>
                  <div class="field">
                    <label for="subscription-token" data-i18n="subscriptionTokenLabel"></label>
                    <input id="subscription-token" type="password" autocomplete="off" />
                    <div class="hint" data-i18n="subscriptionTokenHint"></div>
                  </div>
                  <div class="field">
                    <label for="upstream-override" data-i18n="upstreamOverrideLabel"></label>
                    <input id="upstream-override" type="url" />
                    <div class="hint" data-i18n="upstreamOverrideHint"></div>
                  </div>
                </div>
                <div class="button-row">
                  <button class="button-primary" type="submit" data-i18n="connectButton"></button>
                  <button class="button-ghost" type="button" id="clear-session-button" data-i18n="clearSessionButton"></button>
                </div>
              </form>
            </section>

            <section class="panel pad">
              <div class="section-head">
                <div>
                  <h2 data-i18n="linksTitle"></h2>
                  <p data-i18n="linksDesc"></p>
                </div>
              </div>
              <div class="link-grid">
                <article class="link-card">
                  <h4 data-i18n="clashLinkTitle"></h4>
                  <div class="mono-text"><a id="subscription-link-clash" target="_blank" rel="noreferrer"></a></div>
                  <div class="link-actions"><button class="button-secondary" type="button" data-copy-target="subscription-link-clash" data-i18n="copyButton"></button></div>
                </article>
                <article class="link-card">
                  <h4 data-i18n="clashInlineTitle"></h4>
                  <div class="mono-text"><a id="subscription-link-clash-inline" target="_blank" rel="noreferrer"></a></div>
                  <div class="link-actions"><button class="button-secondary" type="button" data-copy-target="subscription-link-clash-inline" data-i18n="copyButton"></button></div>
                </article>
                <article class="link-card">
                  <h4 data-i18n="uriListTitle"></h4>
                  <div class="mono-text"><a id="subscription-link-uri-list" target="_blank" rel="noreferrer"></a></div>
                  <div class="link-actions"><button class="button-secondary" type="button" data-copy-target="subscription-link-uri-list" data-i18n="copyButton"></button></div>
                </article>
                <article class="link-card">
                  <h4 data-i18n="base64Title"></h4>
                  <div class="mono-text"><a id="subscription-link-base64" target="_blank" rel="noreferrer"></a></div>
                  <div class="link-actions"><button class="button-secondary" type="button" data-copy-target="subscription-link-base64" data-i18n="copyButton"></button></div>
                </article>
              </div>
            </section>
          </div>

          <section class="panel pad" id="token-editor" style="margin-top: 14px;">
            <div class="section-head">
              <div>
                <h2 data-i18n="tokensTitle"></h2>
                <p data-i18n="tokensDesc"></p>
              </div>
              <button class="button-primary" type="button" id="new-token-button" data-i18n="newTokenButton"></button>
            </div>
            <div class="workspace-grid">
              <section>
                <div class="list-stack" id="token-list"></div>
              </section>
              <section class="panel pad" style="box-shadow: none; backdrop-filter: none; background: rgba(255,255,255,0.02);">
                <div class="section-head">
                  <div>
                    <h3 id="token-editor-title"></h3>
                    <p id="token-editor-desc"></p>
                  </div>
                </div>
                <form id="token-form">
                  <input type="hidden" id="token-id" />
                  <div class="grid-two">
                    <div class="field">
                      <label for="token-name" data-i18n="tokenNameLabel"></label>
                      <input id="token-name" type="text" />
                    </div>
                    <div class="field">
                      <label class="pill" style="width: fit-content; cursor: pointer; margin-top: 30px;">
                        <input id="token-enabled" type="checkbox" checked style="width: auto; margin-right: 8px;" />
                        <span data-i18n="enabledLabel"></span>
                      </label>
                    </div>
                  </div>
                  <div class="field-wide">
                    <label for="token-notes" data-i18n="tokenNotesLabel"></label>
                    <textarea id="token-notes"></textarea>
                  </div>
                  <div class="field-wide">
                    <label for="token-plaintext" data-i18n="tokenPlaintextLabel"></label>
                    <input id="token-plaintext" type="text" autocomplete="off" />
                    <div class="hint" data-i18n="tokenPlaintextHint"></div>
                    <div class="button-row" style="margin-top: 10px;">
                      <button class="button-secondary" type="button" id="generate-token-button" data-i18n="tokenGenerateButton"></button>
                    </div>
                  </div>
                  <div class="field-wide">
                    <label data-i18n="tokenScopesLabel"></label>
                    <div class="scope-grid">
                      <label class="scope-pill"><input id="token-scope-admin" type="checkbox" /><span data-i18n="tokenScopeAdmin"></span></label>
                      <label class="scope-pill"><input id="token-scope-subscriptions-read" type="checkbox" /><span data-i18n="tokenScopeSubscriptionsRead"></span></label>
                      <label class="scope-pill"><input id="token-scope-proxies-read" type="checkbox" /><span data-i18n="tokenScopeProxiesRead"></span></label>
                      <label class="scope-pill"><input id="token-scope-proxies-write" type="checkbox" /><span data-i18n="tokenScopeProxiesWrite"></span></label>
                      <label class="scope-pill"><input id="token-scope-sources-read" type="checkbox" /><span data-i18n="tokenScopeSourcesRead"></span></label>
                      <label class="scope-pill"><input id="token-scope-sources-write" type="checkbox" /><span data-i18n="tokenScopeSourcesWrite"></span></label>
                      <label class="scope-pill"><input id="token-scope-rules-read" type="checkbox" /><span data-i18n="tokenScopeRulesRead"></span></label>
                      <label class="scope-pill"><input id="token-scope-rules-write" type="checkbox" /><span data-i18n="tokenScopeRulesWrite"></span></label>
                      <label class="scope-pill"><input id="token-scope-tokens-read" type="checkbox" /><span data-i18n="tokenScopeTokensRead"></span></label>
                      <label class="scope-pill"><input id="token-scope-tokens-write" type="checkbox" /><span data-i18n="tokenScopeTokensWrite"></span></label>
                    </div>
                  </div>
                  <div class="token-preview is-hidden" id="token-preview-wrap">
                    <h4 data-i18n="tokenPreviewTitle"></h4>
                    <pre id="token-preview"></pre>
                    <div class="builder-note" data-i18n="tokenPreviewHint"></div>
                  </div>
                  <div class="editor-actions" style="margin-top: 16px;">
                    <button class="button-primary" type="submit" data-i18n="saveTokenButton"></button>
                    <button class="button-ghost" type="button" id="reset-token-editor" data-i18n="resetTokenButton"></button>
                  </div>
                </form>
              </section>
            </div>
          </section>
        </section>

        <section class="tab-panel is-hidden" data-tab-panel="nodes">
          <div class="workspace-grid">
            <section class="panel pad">
              <div class="section-head">
                <div>
                  <h3 data-i18n="nodesTitle"></h3>
                  <p data-i18n="nodesDesc"></p>
                </div>
                <button class="button-primary" type="button" id="new-proxy-button" data-i18n="newNodeButton"></button>
              </div>
              <div class="toolbar-row">
                <div class="field" style="margin-bottom: 0;">
                  <label for="proxy-search" data-i18n="searchNodesLabel"></label>
                  <input id="proxy-search" type="text" data-i18n-placeholder="searchNodesPlaceholder" />
                </div>
                <div class="field" style="margin-bottom: 0;">
                  <label for="proxy-protocol-filter" data-i18n="filterProtocolLabel"></label>
                  <select id="proxy-protocol-filter">
                    <option value="all" data-i18n="filterProtocolAll">All Protocols</option>
                    <option value="vless">VLESS</option>
                    <option value="vmess">VMESS</option>
                    <option value="trojan">TROJAN</option>
                    <option value="ss">SS</option>
                  </select>
                </div>
              </div>
              <div class="list-stack" id="proxy-list"></div>
            </section>

            <section class="panel" id="proxy-editor">
              <div class="editor-shell">
                <div class="section-head">
                  <div>
                    <h3 id="proxy-editor-title"></h3>
                    <p id="proxy-editor-desc"></p>
                  </div>
                </div>
                <form id="proxy-form">
                  <input type="hidden" id="proxy-id" />
                  <div class="grid-two">
                    <div class="field">
                      <label for="proxy-name" data-i18n="nodeNameLabel"></label>
                      <input id="proxy-name" type="text" />
                    </div>
                    <div class="field">
                      <label for="proxy-priority" data-i18n="priorityLabel"></label>
                      <input id="proxy-priority" type="number" value="100" />
                    </div>
                  </div>
                  <div class="grid-two">
                    <div class="field">
                      <label for="proxy-tags" data-i18n="tagsLabel"></label>
                      <input id="proxy-tags" type="text" />
                      <div class="hint" data-i18n="tagsHint"></div>
                    </div>
                    <div class="field">
                      <label class="pill" style="width: fit-content; cursor: pointer; margin-top: 30px;">
                        <input id="proxy-enabled" type="checkbox" checked style="width: auto; margin-right: 8px;" />
                        <span data-i18n="enabledLabel"></span>
                      </label>
                    </div>
                  </div>
                  <div class="field-wide">
                    <label for="proxy-notes" data-i18n="notesLabel"></label>
                    <textarea id="proxy-notes" data-i18n-placeholder="notesPlaceholder"></textarea>
                  </div>

                  <div class="mode-switch">
                    <button type="button" data-proxy-mode="manual" data-i18n="modeManual"></button>
                    <button type="button" data-proxy-mode="uri" data-i18n="modeUri"></button>
                  </div>

                  <div id="proxy-uri-panel" class="mode-panel is-hidden">
                    <div class="field-wide">
                      <label for="proxy-uri" data-i18n="rawUriLabel"></label>
                      <textarea id="proxy-uri" data-i18n-placeholder="rawUriPlaceholder"></textarea>
                      <div class="stack-actions">
                        <button class="button-secondary" type="button" id="proxy-import-uri" data-i18n="importUriButton"></button>
                      </div>
                    </div>
                  </div>

                  <div id="proxy-manual-panel" class="mode-panel">
                    <div class="grid-three">
                      <div class="field">
                        <label for="proxy-manual-protocol" data-i18n="protocolLabel"></label>
                        <select id="proxy-manual-protocol">
                          <option value="vless">VLESS</option>
                          <option value="trojan">Trojan</option>
                          <option value="vmess">VMess</option>
                          <option value="ss">Shadowsocks</option>
                        </select>
                      </div>
                      <div class="field">
                        <label for="proxy-manual-host" data-i18n="hostLabel"></label>
                        <input id="proxy-manual-host" type="text" data-i18n-placeholder="hostPlaceholder" />
                      </div>
                      <div class="field">
                        <label for="proxy-manual-port" data-i18n="portLabel"></label>
                        <input id="proxy-manual-port" type="number" />
                      </div>
                    </div>

                    <div class="grid-three">
                      <div class="field protocol-only" data-protocols="vless vmess">
                        <label for="proxy-manual-uuid" data-i18n="uuidLabel"></label>
                        <input id="proxy-manual-uuid" type="text" />
                      </div>
                      <div class="field protocol-only" data-protocols="trojan ss">
                        <label for="proxy-manual-password" data-i18n="passwordLabel"></label>
                        <input id="proxy-manual-password" type="text" />
                      </div>
                      <div class="field protocol-only" data-protocols="ss vmess">
                        <label for="proxy-manual-cipher" data-i18n="cipherLabel"></label>
                        <input id="proxy-manual-cipher" type="text" value="auto" />
                      </div>
                    </div>

                    <div class="grid-three">
                      <div class="field protocol-only" data-protocols="vmess">
                        <label for="proxy-manual-alter-id" data-i18n="alterIdLabel"></label>
                        <input id="proxy-manual-alter-id" type="number" value="0" />
                      </div>
                      <div class="field protocol-only" data-protocols="vless">
                        <label for="proxy-manual-flow" data-i18n="flowLabel"></label>
                        <input id="proxy-manual-flow" type="text" />
                      </div>
                      <div class="field">
                        <label for="proxy-manual-network" data-i18n="networkLabel"></label>
                        <select id="proxy-manual-network">
                          <option value="tcp">TCP</option>
                          <option value="ws">WebSocket</option>
                          <option value="grpc">gRPC</option>
                          <option value="http">HTTP</option>
                          <option value="h2">HTTP/2</option>
                        </select>
                      </div>
                    </div>

                    <div class="grid-three">
                      <div class="field protocol-only" data-protocols="vless trojan vmess">
                        <label for="proxy-manual-security" data-i18n="securityLabel"></label>
                        <select id="proxy-manual-security">
                          <option value="none">None</option>
                          <option value="tls">TLS</option>
                          <option value="reality">Reality</option>
                        </select>
                      </div>
                      <div class="field protocol-only" data-protocols="vless trojan vmess">
                        <label for="proxy-manual-sni" data-i18n="sniLabel"></label>
                        <input id="proxy-manual-sni" type="text" />
                      </div>
                      <div class="field protocol-only" data-protocols="vless trojan vmess">
                        <label for="proxy-manual-host-header" data-i18n="hostHeaderLabel"></label>
                        <input id="proxy-manual-host-header" type="text" />
                      </div>
                    </div>

                    <div class="grid-two">
                      <div class="field network-only" data-networks="ws http h2">
                        <label for="proxy-manual-path" data-i18n="pathLabel"></label>
                        <input id="proxy-manual-path" type="text" />
                      </div>
                      <div class="field network-only" data-networks="grpc">
                        <label for="proxy-manual-service-name" data-i18n="grpcServiceLabel"></label>
                        <input id="proxy-manual-service-name" type="text" />
                      </div>
                    </div>

                    <div class="grid-three">
                      <div class="field protocol-only" data-protocols="vless trojan">
                        <label class="pill" style="width: fit-content; cursor: pointer; margin-top: 28px;">
                          <input id="proxy-manual-allow-insecure" type="checkbox" style="width: auto; margin-right: 8px;" />
                          <span data-i18n="allowInsecureLabel"></span>
                        </label>
                      </div>
                      <div class="field security-only" data-security-values="reality">
                        <label for="proxy-manual-public-key" data-i18n="realityPublicKeyLabel"></label>
                        <input id="proxy-manual-public-key" type="text" />
                      </div>
                      <div class="field security-only" data-security-values="reality">
                        <label for="proxy-manual-short-id" data-i18n="realityShortIdLabel"></label>
                        <input id="proxy-manual-short-id" type="text" />
                      </div>
                    </div>

                    <div class="grid-two">
                      <div class="field protocol-only" data-protocols="ss">
                        <label for="proxy-manual-plugin" data-i18n="ssPluginLabel"></label>
                        <input id="proxy-manual-plugin" type="text" />
                      </div>
                      <div class="field protocol-only" data-protocols="ss">
                        <label for="proxy-manual-plugin-opts" data-i18n="ssPluginOptsLabel"></label>
                        <input id="proxy-manual-plugin-opts" type="text" />
                      </div>
                    </div>
                  </div>

                  <div class="field-wide">
                    <label for="proxy-clash-overrides" data-i18n="clashOverridesLabel"></label>
                    <textarea id="proxy-clash-overrides" data-i18n-placeholder="clashOverridesPlaceholder"></textarea>
                  </div>

                  <div class="preview-box">
                    <h4 data-i18n="uriPreviewTitle"></h4>
                    <pre id="proxy-uri-preview"></pre>
                  </div>

                  <div class="editor-actions" style="margin-top: 18px;">
                    <button class="button-primary" type="submit" data-i18n="saveNodeButton"></button>
                    <button class="button-ghost" type="button" id="reset-proxy-editor" data-i18n="resetEditorButton"></button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </section>

        <section class="tab-panel is-hidden" data-tab-panel="sources">
          <div class="workspace-grid">
            <section class="panel pad">
              <div class="section-head">
                <div>
                  <h3 data-i18n="sourcesTitle"></h3>
                  <p data-i18n="sourcesDesc"></p>
                </div>
                <button class="button-primary" type="button" id="new-source-button" data-i18n="newSourceButton"></button>
              </div>
              <div class="list-stack" id="source-list"></div>
            </section>

            <section class="panel" id="source-editor">
              <div class="editor-shell">
                <div class="section-head">
                  <div>
                    <h3 id="source-editor-title"></h3>
                    <p id="source-editor-desc"></p>
                  </div>
                </div>
                <form id="source-form">
                  <input type="hidden" id="source-id" />
                  <div class="grid-two">
                    <div class="field">
                      <label for="source-name" data-i18n="sourceNameLabel"></label>
                      <input id="source-name" type="text" />
                    </div>
                    <div class="field">
                      <label for="source-format" data-i18n="sourceFormatLabel"></label>
                      <select id="source-format">
                        <option value="auto" data-i18n="sourceFormatAuto">Auto Detect</option>
                        <option value="base64" data-i18n="sourceFormatBase64">Base64 Node Feed</option>
                        <option value="uri-list" data-i18n="sourceFormatUriList">URI List</option>
                        <option value="clash-yaml" data-i18n="sourceFormatClashYaml">Clash YAML</option>
                      </select>
                    </div>
                  </div>
                  <div class="field-wide">
                    <label for="source-url" data-i18n="sourceUrlLabel"></label>
                    <textarea id="source-url"></textarea>
                  </div>
                  <div class="grid-two">
                    <div class="field">
                      <label for="source-priority" data-i18n="priorityLabel"></label>
                      <input id="source-priority" type="number" value="100" />
                    </div>
                    <div class="field">
                      <label class="pill" style="width: fit-content; cursor: pointer; margin-top: 30px;">
                        <input id="source-enabled" type="checkbox" checked style="width: auto; margin-right: 8px;" />
                        <span data-i18n="enabledLabel"></span>
                      </label>
                    </div>
                  </div>
                  <div class="field-wide">
                    <label for="source-notes" data-i18n="sourceNotesLabel"></label>
                    <textarea id="source-notes"></textarea>
                  </div>
                  <div class="editor-actions">
                    <button class="button-primary" type="submit" data-i18n="saveSourceButton"></button>
                    <button class="button-ghost" type="button" id="reset-source-editor" data-i18n="resetSourceButton"></button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </section>

        <section class="tab-panel is-hidden" data-tab-panel="rules">
          <div class="workspace-grid">
            <section class="panel pad">
              <div class="section-head">
                <div>
                  <h3 data-i18n="rulesTitle"></h3>
                  <p data-i18n="rulesDesc"></p>
                </div>
                <button class="button-primary" type="button" id="new-rule-set-button" data-i18n="newRuleSetButton"></button>
              </div>
              <div class="list-stack" id="rule-set-list"></div>
            </section>

            <section class="panel" id="rule-set-editor">
              <div class="editor-shell">
                <div class="section-head">
                  <div>
                    <h3 id="rule-set-editor-title"></h3>
                    <p id="rule-set-editor-desc"></p>
                  </div>
                </div>
                <form id="rule-set-form">
                  <input type="hidden" id="rule-set-id" />
                  <div class="grid-two">
                    <div class="field">
                      <label for="rule-set-name" data-i18n="ruleSetNameLabel"></label>
                      <input id="rule-set-name" type="text" />
                    </div>
                    <div class="field">
                      <label for="rule-set-format" data-i18n="formatLabel"></label>
                      <select id="rule-set-format">
                        <option value="rule-lines">rule-lines</option>
                        <option value="clash-fragment">clash-fragment</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid-two">
                    <div class="field">
                      <label for="rule-set-priority" data-i18n="priorityLabel"></label>
                      <input id="rule-set-priority" type="number" value="100" />
                    </div>
                    <div class="field">
                      <label class="pill" style="width: fit-content; cursor: pointer; margin-top: 30px;">
                        <input id="rule-set-enabled" type="checkbox" checked style="width: auto; margin-right: 8px;" />
                        <span data-i18n="enabledLabel"></span>
                      </label>
                    </div>
                  </div>
                  <div class="field-wide">
                    <label for="rule-set-notes" data-i18n="ruleNotesLabel"></label>
                    <textarea id="rule-set-notes" data-i18n-placeholder="ruleNotesPlaceholder"></textarea>
                  </div>
                  <div class="field-wide" id="rule-set-content-wrap">
                    <label for="rule-set-content" data-i18n="ruleContentLabel"></label>
                    <textarea id="rule-set-content"></textarea>
                    <div class="mono-hint" data-i18n="ruleContentHint"></div>
                  </div>
                  <div class="builder-card" id="rule-builder-card">
                    <h4 data-i18n="ruleBuilderTitle"></h4>
                    <p data-i18n="ruleBuilderDesc"></p>
                    <div class="inline-field-row">
                      <div class="field" style="margin-bottom: 0;">
                        <label for="rule-builder-type" data-i18n="ruleTypeLabel"></label>
                        <select id="rule-builder-type">
                          <option value="DOMAIN-SUFFIX">DOMAIN-SUFFIX</option>
                          <option value="DOMAIN-KEYWORD">DOMAIN-KEYWORD</option>
                          <option value="DOMAIN">DOMAIN</option>
                          <option value="GEOSITE">GEOSITE</option>
                          <option value="GEOIP">GEOIP</option>
                          <option value="IP-CIDR">IP-CIDR</option>
                          <option value="IP-CIDR6">IP-CIDR6</option>
                          <option value="PROCESS-NAME">PROCESS-NAME</option>
                          <option value="PROCESS-PATH">PROCESS-PATH</option>
                          <option value="DST-PORT">DST-PORT</option>
                          <option value="SRC-PORT">SRC-PORT</option>
                          <option value="MATCH">MATCH</option>
                        </select>
                      </div>
                      <div class="field" style="margin-bottom: 0;">
                        <label for="rule-builder-value" data-i18n="ruleValueLabel"></label>
                        <input id="rule-builder-value" type="text" placeholder="google.com / cn / 1.1.1.0/24" />
                      </div>
                      <div class="field" style="margin-bottom: 0;">
                        <label for="rule-builder-target" data-i18n="ruleTargetLabel"></label>
                        <select id="rule-builder-target">
                          <option value="Proxy" data-i18n="ruleTargetProxy">Proxy</option>
                          <option value="DIRECT" data-i18n="ruleTargetDirect">DIRECT</option>
                          <option value="REJECT" data-i18n="ruleTargetReject">REJECT</option>
                          <option value="Auto" data-i18n="ruleTargetAuto">Auto</option>
                          <option value="__custom__" data-i18n="ruleTargetCustom">Custom...</option>
                        </select>
                      </div>
                      <div class="field" style="margin-bottom: 0;">
                        <label for="rule-builder-extra" data-i18n="ruleExtraLabel"></label>
                        <select id="rule-builder-extra">
                          <option value="" data-i18n="ruleExtraNone">None</option>
                          <option value="no-resolve" data-i18n="ruleExtraNoResolve">no-resolve</option>
                        </select>
                      </div>
                    </div>
                    <div class="field" style="margin-top: 12px; margin-bottom: 0;">
                      <label for="rule-builder-target-custom" data-i18n="ruleTargetCustomLabel"></label>
                      <input id="rule-builder-target-custom" class="is-hidden" type="text" placeholder="Streaming / Apple / Game / your-own-group" />
                    </div>
                    <div class="button-row" style="margin-top: 12px;">
                      <button class="button-secondary" type="button" id="rule-builder-add" data-i18n="addRuleLineButton"></button>
                    </div>
                    <div class="builder-note" data-i18n="ruleBuilderHelper"></div>
                  </div>
                  <div class="field-wide" id="rule-line-list-wrap">
                    <div class="line-list" id="rule-line-list"></div>
                  </div>
                  <div class="editor-actions">
                    <button class="button-primary" type="submit" data-i18n="saveRuleButton"></button>
                    <button class="button-ghost" type="button" id="reset-rule-set-editor" data-i18n="resetRuleButton"></button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>

    <div class="toast" id="toast"></div>
    <script>${adminScript}</script>
  </body>
</html>`;
}
