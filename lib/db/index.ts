import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __rekluPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL is not set");
}

// Reuse the pool across hot reloads in dev so we don't exhaust connections.
const pool =
  global.__rekluPool ??
  new Pool({
    connectionString: connectionString ?? "postgres://placeholder",
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global.__rekluPool = pool;
}

export const db = drizzle(pool, { schema, casing: "snake_case" });
export { schema };
export * from "./schema";