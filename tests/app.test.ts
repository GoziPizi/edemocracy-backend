import { Affiliation, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();

  // Nettoyer la base de données
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;

  await prisma.user.createMany({
    data : [
      {firstName: 'Alice', name: 'Dupont', email: 'alice.dupont@gmail.com', password: 'password', telephone: '0123456789', isVerified: true, language: 'fr', role: Role.ADMIN, address: '1 rue de la Paix, Paris', politicSide: Affiliation.LEFT, contributionStatus: null, postalCode: '77777', city: 'aaaa'},
    ]
  })
});

describe('Initialized test', () => {
  it('Verify tests start', () => {
    expect(true).toBe(true); // Exemple de test trivial
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

