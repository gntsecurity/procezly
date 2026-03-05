import postgres from "postgres";

export type Db = ReturnType<typeof postgres>;

export function createDb(databaseUrl: string) {
  return postgres(databaseUrl, { max: 10, idle_timeout: 30 });
}
