## MODIFIED Requirements

### Requirement: 主题定制

系统 SHALL 使用 Astro Theme Typography 作为默认主题，并允许通过配置文件自定义颜色、字体、布局等视觉样式。

#### Scenario: 默认主题渲染
- **WHEN** 站点使用默认配置
- **THEN** 显示 Typography 主题的默认样式，包含优化的中文排版

#### Scenario: 自定义配置
- **WHEN** 用户在 `src/.config/user.ts` 中修改配置
- **THEN** 站点使用用户自定义的配置（颜色、导航、社交链接等）

#### Scenario: 黑暗模式
- **WHEN** 用户在配置中设置 themeStyle 为 'dark' 或 'system'
- **THEN** 站点支持黑暗模式，并根据系统偏好自动切换

#### Scenario: 中文语言支持
- **WHEN** 用户在配置中设置 locale 为 'zh-cn'
- **THEN** 站点使用中文界面，符合中文排版规范
