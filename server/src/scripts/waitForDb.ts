import { Client } from "pg";

export async function waitForDb() {
  for (let attempt = 0; attempt < 30; attempt++) {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
      await client.connect();
      await client.query('SELECT 1');
      console.log('Database is ready!');
      return;
    } catch (err) {
      console.log(`Waiting for DB... (${attempt + 1}/30)`);
      await new Promise((res) => setTimeout(res, 2000));
    } finally {
      await client.end().catch(() => { });
    }
  }
  throw new Error('Database not ready after 30 attempts!');
}