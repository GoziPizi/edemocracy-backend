import { Affiliation, PrismaClient, Role } from "@prisma/client";
import request from 'supertest';
import app from '../src/index';
import RawQueryRepository from "@/repositories/RawQueryRepository";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();

  // Nettoyer la base de données
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;

  const default_password = 'password';
  const hashedDefaultPassword = await new RawQueryRepository().getSha256(default_password)

  //Creation des utilisateurs
  await prisma.user.createMany({
    data : [
      {firstName: 'Alice', name: 'Dupont', email: 'alice.dupont@gmail.com', password: hashedDefaultPassword, telephone: '0123456789', isVerified: true, language: 'fr', role: Role.ADMIN, address: '1 rue de la Paix, Paris', politicSide: Affiliation.LEFT, contributionStatus: null, postalCode: '77777', city: 'aaaa'},
    ]
  })

  //Get the tokens
  const response = await request(app).post('/api/login').send({
    email: 'alice.dupont@gmail.com',
    password: default_password,
  });

  console.log('Login response:', response.body); // Debug supplémentaire
  const adminToken = response.body.key;

  if (!adminToken) {
    throw new Error('Token non récupéré. Vérifiez la route de login.');
  }

  process.env.ADMIN_TOKEN = adminToken;
  console.log('Token:', adminToken);
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Initialized test', () => {
  it('Verify tests start', () => {
    expect(true).toBe(true); // Exemple de test trivial
  });
});



