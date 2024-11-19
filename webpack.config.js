import path from "path";
import { fileURLToPath } from "url";
import Dotenv from "dotenv-webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./service-worker.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
  plugins: [new Dotenv()],
  target: "webworker",
  externals: ["chrome"],
};
