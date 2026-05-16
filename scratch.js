import 'dotenv/config'; // will load from poddy/.env which might not have DATABASE_URL
import sql from '../poddy-be/config/neon.js';
async function run() {
  try {
    const res = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'podcasts'`;
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch(e) {
    console.error(e);
  }
}
run();
