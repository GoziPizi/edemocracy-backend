import { Affiliation, PrismaClient, Role } from "@prisma/client";
import RawQueryRepository from "@/repositories/RawQueryRepository";
import app from "@/index";
import request from 'supertest';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();

  // Nettoyer la base de données
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Topic" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Debate" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Argument" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Reporting" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "ReportingEvent" CASCADE;`;

  const default_password = 'password';
  const hashedDefaultPassword = await new RawQueryRepository().getSha256(default_password)

  //Creation des utilisateurs
  await prisma.user.createMany({
    data : [
      {id:'1', firstName: 'Alice', name: 'Dupont', email: 'alice.dupont@gmail.com', password: hashedDefaultPassword, telephone: '0123456789', isVerified: true, language: 'fr', role: Role.ADMIN, address: '1 rue de la Paix, Paris', politicSide: Affiliation.LEFT, contributionStatus: null, postalCode: '77777', city: 'aaaa'},
      {firstName: 'Bob', name: 'Martin', email: 'bob.martin@gmail.com', password: hashedDefaultPassword, telephone: '0123456789', isVerified: true, language: 'fr', role: Role.MODERATOR1, address: '1 rue de la Paix, Paris', politicSide: Affiliation.LEFT, contributionStatus: null, postalCode: '77777', city: 'aaaa'},
      {firstName: 'Charlie', name: 'Dupuis', email: 'charlie.dupuis@gmail.com', password: hashedDefaultPassword, telephone: '0123456789', isVerified: true, language: 'fr', role: Role.MODERATOR2, address: '1 rue de la Paix, Paris', politicSide: Affiliation.LEFT, contributionStatus: null, postalCode: '77777', city: 'aaaa'},
      {id:'JESUISBOB', firstName: 'David', name: 'Durand', email: 'david.durand@gmail.com', password: hashedDefaultPassword, telephone: '0123456789', isVerified: true, language: 'fr', role: Role.USER, address: '1 rue de la Paix, Paris', politicSide: Affiliation.LEFT, contributionStatus: null, postalCode: '77777', city: 'aaaa'},
    ]
  })

  //create topics
  await prisma.topic.createMany({
    data: [
      {id: 'topic-first-id', userId: 'JESUISBOB', title: 'topic1', description: 'description1'}
    ]
  })

  const response = await request(app).post('/api/login').send({
    email: 'alice.dupont@gmail.com',
    password: default_password,
  });

  const adminToken = response.body.key;

  if (!adminToken) {
    throw new Error('Token non récupéré. Vérifiez la route de login.');
  }

  process.env.ADMIN_TOKEN = adminToken;


  //create a debate via an API call directly
  const response2 = await request(app).post('/api/debates').send({
    title: 'Debate1',
    content: 'content',
    topicId: 'topic-first-id'
  }).set('Authorization', process.env.ADMIN_TOKEN as string);

  const debateId = response2.body.id;
  process.env.DEBATE_ID = debateId;

  //create an argument via direct API call

  const response3 = await request(app).post('/api/arguments').send({
    content: 'content',
    debateId: debateId,
    type: 'FOR',
    title: 'title'
  }).set('Authorization', process.env.ADMIN_TOKEN as string);

  const argumentId = response3.body.id;
  process.env.ARGUMENT_ID = argumentId;

});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Initialized test', () => {
  it('Verify tests start', () => {
    expect(true).toBe(true); // Exemple de test trivial
  });
});



