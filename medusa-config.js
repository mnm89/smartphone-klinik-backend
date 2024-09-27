const dotenv = require("dotenv");

const ENV_FILE_NAME = ".env";
try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

function ensureEnvVariable(name) {
  const variable = process.env[name];

  if (!variable) throw new Error(`"${name}" is not defined in env`);
  return variable;
}

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: ensureEnvVariable("REDIS_URL"),
    },
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: ensureEnvVariable("REDIS_URL"),
    },
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: ensureEnvVariable("JWT_SECRET"),
  cookie_secret: ensureEnvVariable("COOKIE_SECRET"),
  store_cors: ensureEnvVariable("STORE_CORS"),
  database_url: ensureEnvVariable("DATABASE_URL"),
  admin_cors: ensureEnvVariable("ADMIN_CORS"),
  redis_url: ensureEnvVariable("REDIS_URL"),
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
