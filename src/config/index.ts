import dotenv from "dotenv";

import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT || 5000,
  connecting_string: process.env.CONNECTION_STRING,
};

export default config;
