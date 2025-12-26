import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  site: {
    title: 'skmang_notes',
    subtitle: '个人开发知识库',
    author: 'skmang',
    description: '记录开发过程中的学习和思考',
    website: 'https://skmang.github.io/skmang_notes/',
    pageSize: 10,
    socialLinks: [
      {
        name: 'github',
        href: 'https://github.com/skmang',
      },
      {
        name: 'rss',
        href: '/atom.xml',
      },
    ],
    navLinks: [
      {
        name: 'Posts',
        href: '/',
      },
      {
        name: 'Archive',
        href: '/archive',
      },
      {
        name: 'Categories',
        href: '/categories',
      },
      {
        name: 'About',
        href: '/about',
      },
    ],
    footer: [
      '© %year <a target="_blank" href="%website">%author</a>',
      'Theme <a target="_blank" href="https://github.com/Moeyua/astro-theme-typography">Typography</a> by <a target="_blank" href="https://moeyua.com">Moeyua</a>',
      'Proudly published with <a target="_blank" href="https://astro.build/">Astro</a>',
    ],
  },
  appearance: {
    theme: 'system',
    locale: 'zh-cn',
  },
  seo: {
    twitter: '', // 可选：你的 Twitter 用户名
    meta: [],
    link: [],
  },
  rss: {
    fullText: true,
  },
  comment: {
    // Giscus 评论系统配置
    giscus: {
      repo: 'skmang/skmang_notes',
      repoId: 'R_kgDOQvIC8w',
      category: 'Announcements',
      categoryId: 'DIC_kwDOQvIC884C0QWi',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'top',
      theme: 'light',
      lang: 'zh-CN',
      loading: 'lazy',
    },
    // disqus: { shortname: "your-disqus-shortname" }, // 可选：Disqus
  },
  analytics: {
    googleAnalyticsId: '', // 可选：Google Analytics ID
    umamiAnalyticsId: '', // 可选：Umami Analytics ID
  },
  latex: {
    katex: false, // 如果需要数学公式支持，设为 true
  },
}
