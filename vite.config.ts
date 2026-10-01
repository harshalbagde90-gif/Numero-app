import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import fs from "node:fs";
import { componentTagger } from "lovable-tagger";

// Match the generated article routing used by Vercel in the local production preview.
export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "preview-blog-html",
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const route = new URL(req.url || "/", "http://localhost").pathname.replace(/\/+$/, "");
          if (route !== "/blog" && !/^\/blog\/[a-z0-9-]+$/.test(route)) return next();
          const file = path.join(__dirname, "dist", route.slice(1), "index.html");
          if (!fs.existsSync(file)) {
            res.statusCode = 404;
            res.end("Article not found");
            return;
          }
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(fs.readFileSync(file));
        });
      },
    },
  ].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
