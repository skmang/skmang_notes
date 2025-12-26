import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const allPosts = await getCollection('blog');
  const publishedPosts = allPosts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'ProjectDocs Blog',
    description: '个人开发知识库博客',
    site: context.site,
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/blog/posts/${post.slug}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
