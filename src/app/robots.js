export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
    ],
    sitemap: 'https://goolza.com/sitemap.xml',
    host: 'https://goolza.com',
  };
}
