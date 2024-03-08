import { PrismaClient } from "@prisma/client";

import seedUser from "./user.seed";

const prisma = new PrismaClient();

async function main() {
  await seedUser(prisma);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });