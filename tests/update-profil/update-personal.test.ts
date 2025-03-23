import request from 'supertest';
import app from '../../src/index';
import { PrismaClient } from '@prisma/client';
import { after } from 'node:test';

const prisma = new PrismaClient();

const userMail = 'alice.dupont@gmail.com';
const password = 'password';

beforeAll(async () => {
  //Connect to the app and retrieve the token

  const response = await request(app).post('/api/login').send({
    email: userMail,
    password: password,
  });
  if (!response.body.key) {
    throw new Error('Token non récupéré. Vérifiez la route de login.');
  }

  process.env.ADMIN_TOKEN = response.body.key;
  console.log('Token: ' + process.env.ADMIN_TOKEN);
});

//Retrieve personal info

let expectedCurrentInfos: any;

describe('Retrieve personal info', () => {
  it('should return personal info', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', process.env.ADMIN_TOKEN as string);
    expect(response.status).toBe(200);
    expectedCurrentInfos = response.body;
  });
});

//Set all origins to null

describe('Set all origins to null', () => {
  it('should set all origins to null', async () => {
    let newCurrentInfos = expectedCurrentInfos;
    newCurrentInfos.origin1 = null;
    newCurrentInfos.origin2 = null;
    newCurrentInfos.origin3 = null;
    newCurrentInfos.origin4 = null;
    const response = await request(app)
      .put('/api/users')
      .send(newCurrentInfos)
      .set('Authorization', process.env.ADMIN_TOKEN as string);
    expect(response.status).toBe(200);
    expectedCurrentInfos = newCurrentInfos;
  });
});

//Retrieve personal info again

describe('Retrieve personal info again', () => {
  it('should return personal info', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', process.env.ADMIN_TOKEN as string);
    expect(response.status).toBe(200);
    expectedCurrentInfos = response.body;
    expectedCurrentInfos;
    expect(expectedCurrentInfos.origin1).toBe(null);
    expect(expectedCurrentInfos.origin2).toBe(null);
    expect(expectedCurrentInfos.origin3).toBe(null);
    expect(expectedCurrentInfos.origin4).toBe(null);
  });
});

let origin1 = 'Abénaquis';
let origin2 = 'Abkhazes';
let origin3 = 'Algonquins';
let origin4 = 'Alsaciens';

//Sets origins to a valid value

describe('Set origins to valid values', () => {
  it('should set origins to valid values', async () => {
    let newCurrentInfos = expectedCurrentInfos;
    newCurrentInfos.origin1 = origin1;
    newCurrentInfos.origin2 = origin2;
    newCurrentInfos.origin3 = origin3;
    newCurrentInfos.origin4 = origin4;
    const response = await request(app)
      .put('/api/users')
      .send(newCurrentInfos)
      .set('Authorization', process.env.ADMIN_TOKEN as string);
    expect(response.status).toBe(200);
    expectedCurrentInfos = newCurrentInfos;
  });
});

//Retrieve personal info again

describe('Retrieve personal info again', () => {
  it('should return personal info', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', process.env.ADMIN_TOKEN as string);
    expect(response.status).toBe(200);
    expectedCurrentInfos = response.body;
    expect(expectedCurrentInfos.origin1).toBe(origin1);
    expect(expectedCurrentInfos.origin2).toBe(origin2);
    expect(expectedCurrentInfos.origin3).toBe(origin3);
    expect(expectedCurrentInfos.origin4).toBe(origin4);
  });
});
