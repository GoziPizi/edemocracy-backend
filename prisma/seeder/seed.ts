import { PrismaClient } from "@prisma/client";

import seedUser from "./user.seed";
import seedTopics from "./topic.seed";

const prisma = new PrismaClient();

async function main() {
  await seedUser(prisma);
  await seedTopics(prisma);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });