// Prisma 7 Configuration
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("POSTGRES_PRISMA_URL") || env("POSTGRES_URL") || env("DATABASE_URL"),
  },
});
