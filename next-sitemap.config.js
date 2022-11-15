export default {
    siteUrl: 'https://badbird.dev/',
    generateRobotsTxt: true,
    transform: async (config, path) => {
        const pathArray = path.split('/');
        if (pathArray[1] === 'admin') {
            return null;
        }

        // Use default transformation for all other cases
        return {
            loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined, // TODO: get last modified date for blog posts
            alternateRefs: config.alternateRefs ?? [],
        }
    }
}
