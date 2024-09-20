import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.SOME_KEY": JSON.stringify(env.SOME_KEY),
    },
    plugins: [react(), mkcert({ savePath: "./certs", force: true })],
    devServer: {
      https: {
        cert: "./certs/cert.pem",
        key: "./certs/dev.pem",
      },
    },
  };
});
