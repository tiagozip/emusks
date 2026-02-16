import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";

export default defineConfig({
  srcDir: "src",

  title: "emusks - Reverse-engineered Twitter clients for JavaScript",
  description: "Reverse-engineered Twitter clients for JavaScript",
  themeConfig: {
    logo: "/icon.svg",
    siteTitle: "emusks",

    nav: [
      { text: "Home", link: "/" },
      { text: "Getting started", link: "/getting-started/" },
      { text: "API reference", link: "/tweets/tweets" },
    ],

    sidebar: [
      {
        text: "Getting started",
        items: [
          { text: "Overview", link: "/getting-started/" },
          { text: "Installation", link: "/getting-started/installation" },
          { text: "Authentication", link: "/getting-started/authentication" },
          { text: "Configuration", link: "/getting-started/configuration" },
        ],
      },
      {
        text: "Tweets & content",
        collapsed: true,
        items: [
          { text: "Tweets", link: "/tweets/tweets" },
          { text: "Timelines", link: "/tweets/timelines" },
          { text: "Bookmarks", link: "/tweets/bookmarks" },
          { text: "Media", link: "/tweets/media" },
        ],
      },
      {
        text: "Users & social",
        collapsed: true,
        items: [
          { text: "Users", link: "/users/users" },
          { text: "Direct messages", link: "/users/direct-messages" },
          { text: "Lists", link: "/users/lists" },
          { text: "Communities", link: "/users/communities" },
        ],
      },
      {
        text: "Discovery",
        collapsed: true,
        items: [
          { text: "Search", link: "/discovery/search" },
          { text: "Spaces", link: "/discovery/spaces" },
          { text: "Trends", link: "/discovery/trends" },
          { text: "Topics", link: "/discovery/topics" },
        ],
      },
      {
        text: "Account",
        collapsed: true,
        items: [
          { text: "Settings", link: "/account/settings" },
          { text: "Profile", link: "/account/profile" },
          { text: "Security", link: "/account/security" },
          { text: "Preferences", link: "/account/preferences" },
          { text: "Notifications", link: "/account/notifications" },
        ],
      },
      {
        text: "More",
        collapsed: false,
        items: [
          { text: "Running queries", link: "/more/queries" },
          { text: "Search operators", link: "/more/search-operators" },
          { text: "Syndication API", link: "/more/syndication" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/tiagozip/emusks" }],

    search: {
      provider: "local",
    },

    outline: {
      level: [2, 3],
    },

    footer: {
      message: "not affiliated with X Corp.",
      copyright: "released by <a href='https://tiago.zip' target='_blank'>tiago</a> under the aGPL-v3 License.",
    },
    editLink: {
      pattern: "https://github.com/tiagozip/emusks/edit/main/docs/:path",
    },
  },
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  vite: {
    plugins: [llmstxt()],
  },
});
