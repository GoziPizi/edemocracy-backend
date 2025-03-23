import request from 'supertest';
import app from '../../src/index';
import { PrismaClient } from '@prisma/client';
import { after } from 'node:test';

const prisma = new PrismaClient();

/**
 * Init: Create 2 debates
 * 
 * Test1: Merge the 2 debates
 * -> Final state: There is only one debate, all the arguments of the 2 debates are in the new debate
 * 
 * Test2: Merge a debate with itself
 * ->Error, you can't merge a debate with itself
 * 
 * Test3: Merge a debate with a non-existing debate
 * ->Error, the debate to merge with doesn't exist
 * 
 * Test4: Merge a debate and check if parents are updated.
 * 
 */

let parentDebate1: any;
let parentDebate2: any;
let argumentParentDebate1: any;
let argumentParentDebate2: any;

beforeAll(async () => {

    await prisma.$connect();

    //Empty debates table
    await prisma.$executeRaw`TRUNCATE TABLE "Debate" CASCADE;`;
    const adminToken = process.env.ADMIN_TOKEN;
    
    parentDebate1 = await request(app).post('/api/debates').send({
        title: 'parent-debate-1',
        content: 'content',
    }).set('Authorization', adminToken as string);

    parentDebate2 = await request(app).post('/api/debates').send({
        title: 'parent-debate-2',
        content: 'content',
    }).set('Authorization', adminToken as string);

    argumentParentDebate1 = await request(app).post('/api/arguments').send({
        content: 'content',
        debateId: parentDebate1.body.id
    }).set('Authorization', adminToken as string);

    argumentParentDebate2 = await request(app).post('/api/arguments').send({
        content: 'content',
        debateId: parentDebate2.body.id
    }).set('Authorization', adminToken as string);

});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Merge child debates', () => {
    it('Merge the 2 debates', async () => {
        const debate1Id = argumentParentDebate1.body.debateId;
        const debate2Id = argumentParentDebate2.body.debateId;

        const response = await request(app).post(`/api/moderation/debate/${debate1Id}/merge/${debate2Id}`).set('Authorization', process.env.ADMIN_TOKEN as string);

        expect(response.status).toBe(200);
    });
});