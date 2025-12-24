const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.erronak.com';

/**
 * Turn a Next.js page path into a proper route
 */
function pagePathToRoute(filePath) {
  let route = filePath
    .replace('src/pages', '')        // remove pages dir
    .replace(/\.page\.js$/, '')      // remove .page.js
    .replace(/\.page\.mdxponders\//g, '/')     // remove .page.mdx
    .replace(/\/index$/, '/');       // cleanup index routes to /

  // Remove dynamic slug placeholders for sitemap static entries
  return route;
}

function addPage(filePath) {
  const route = pagePathToRoute(filePath);
  return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>monthly</changefreq>
  </url>`;
}

function addProjectUrls() {
  const portfolioPath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');
  if (!fs.existsSync(portfolioPath)) return '';

  const rawData = fs.readFileSync(portfolioPath, 'utf-8');
  const projects = JSON.parse(rawData);

  return projects.map(proj => {
    const slug = proj.slug.startsWith('/') ? proj.slug : `/${proj.slug}`;
    return `  <url>
    <loc>${BASE_URL}${slug}</loc>
    <changefreq>monthly</changefreq>
  </url>`;
  }).join('\n');
}

function addPost(filePath) {
  const slug = filePath
    .replace('src/posts/', '')
    .replace(/\.mdx?$/, '');
  return `  <url>
    <loc>${BASE_URL}/articles/${slug}</loc>
    <changefreq>monthly</changefreq>
  </url>`;
}

async function generateSitemap() {
  const { globby } = await import('globby');

  // Static pages (excluding custom _app/_document/api)
  const pagePaths = await globby([
    'src/pages/**/*{.page.js,.page.mdx}',
    '!src/pages/_*.js',
    '!src/pages/api',
    '!src/pages/projects/[slug].page.js',  // 🚫 ignore dynamic template

  ]);

  // Blog posts (MDX)
  const postPaths = await globby(['src/posts/**/*.mdx']);

  // Compose XML
  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagePaths.map(addPage).join('\n')}
${addProjectUrls()}
${postPaths.map(addPost).join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log(`✅ Sitemap generated with ${pagePaths.length} pages, ${postPaths.length} posts, and project URLs from portfolio.json`);
}

generateSitemap();