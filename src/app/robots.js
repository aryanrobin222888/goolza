export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/", "/go/"],
      },
    ],
    sitemap: "https://goolza.com/sitemap.xml",
  };
}
