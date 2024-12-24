import { createSeedClient } from "@snaplet/seed";

const seed = await createSeedClient();

// Truncate all tables in the database
// await seed.$resetDatabase();

// Seed the database with 10 users
const users = await seed.user((x) => x(10));
const subscriptions = await seed.subscription((x) => x(10));

console.log(users);
console.log(subscriptions);

process.exit();
