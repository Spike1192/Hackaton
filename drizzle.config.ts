import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'talento_tech_db',
  },
} satisfies Config;
