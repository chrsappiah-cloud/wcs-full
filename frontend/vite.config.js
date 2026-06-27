import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

function injectSearchVerification(env) {
  const google = (env.VITE_GOOGLE_SITE_VERIFICATION || "").trim();
  const bing = (env.VITE_BING_SITE_VERIFICATION || "").trim();
  return {
    name: "inject-search-verification",
    transformIndexHtml(html) {
      let out = html;
      if (google) {
        const tag = `<meta name="google-site-verification" content="${google}" />`;
        if (out.includes('name="google-site-verification"')) {
          out = out.replace(
            /<meta name="google-site-verification" content="[^"]*"\s*\/?>/,
            tag
          );
        } else {
          out = out.replace("</head>", `    ${tag}\n  </head>`);
        }
      }
      if (bing) {
        const tag = `<meta name="msvalidate.01" content="${bing}" />`;
        if (!out.includes("msvalidate.01")) {
          out = out.replace("</head>", `    ${tag}\n  </head>`);
        }
      }
      return out;
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  plugins: [vue(), injectSearchVerification(env)],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
};
});
