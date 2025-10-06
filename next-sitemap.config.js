/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://app-burger-builder.vercel.app',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: ['/api/*', '/admin/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/']
            }
        ],
        additionalSitemaps: ['https://app-burger-builder.vercel.app/sitemap.xml']
    },
    transform: async (config, path) => {
        // Custom transform for specific pages
        return {
            loc: path,
            changefreq: 'daily',
            priority: 0.7,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined
        }
    }
}
