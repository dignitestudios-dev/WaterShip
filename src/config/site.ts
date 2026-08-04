export const siteConfig = {
  name: "Next.js Prod App",
  description: "Production grade Next.js App Router project setup.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example/repo",
  },
};

export type SiteConfig = typeof siteConfig;
