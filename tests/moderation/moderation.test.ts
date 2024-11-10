import request from 'supertest';
import app from '../../src/index';

beforeAll(async () => {

    const default_password = 'password';

    const response = await request(app).post('/api/login').send({
        email: 'alice.dupont@gmail.com',
        password: default_password,
      });
    
      const adminToken = response.body.key;
    
      if (!adminToken) {
        throw new Error('Token non récupéré. Vérifiez la route de login.');
      }
    
      process.env.ADMIN_TOKEN = adminToken;
    
      const response2 = await request(app).post('/api/login').send({
        email: 'bob.martin@gmail.com',
        password: default_password,
      });
    
      const moderator1Token = response2.body.key;
    
      if (!moderator1Token) {
        throw new Error('Token non récupéré. Vérifiez la route de login.');
      }
    
      process.env.MODERATOR1_TOKEN = moderator1Token;
    
      const response3 = await request(app).post('/api/login').send({
        email: 'charlie.dupuis@gmail.com',
        password: default_password,
      });
    
      const moderator2Token = response3.body.key;
    
      if (!moderator2Token) {
        throw new Error('Token non récupéré. Vérifiez la route de login.');
      }
    
      process.env.MODERATOR2_TOKEN = moderator2Token;
    
      const response4 = await request(app).post('/api/login').send({
        email: 'david.durand@gmail.com',
        password: default_password,
      });
    
      const userToken = response4.body.key;
    
      if (!userToken) {
        throw new Error('Token non récupéré. Vérifiez la route de login.');
      }
    
      process.env.USER_TOKEN = userToken;
    });

//Get reports as unidentified user

describe('GET /moderation/reports', () => {
    it('should return 401', async () => {
        const response = await request(app).get('/api/moderation/reports');
        expect(response.status).toBe(401);
    });
});

//Get reports as identified user
describe('GET /moderation/reports', () => {
    it('should return 403', async () => {
        const response = await request(app).get('/api/moderation/reports').set('Authorization', `${process.env.USER_TOKEN}`);
        expect(response.status).toBe(403);
    });
});

//Get reports as moderator 1
describe('GET /moderation/reports', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/api/moderation/reports').set('Authorization', `${process.env.MODERATOR1_TOKEN}`);
        expect(response.status).toBe(200);
    });
});

//Get reports as moderator 2
describe('GET /moderation/reports', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/api/moderation/reports').set('Authorization', `${process.env.MODERATOR2_TOKEN}`);
        expect(response.status).toBe(200);
    });
});

//Get reports as admin
describe('GET /moderation/reports', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/api/moderation/reports').set('Authorization', `${process.env.ADMIN_TOKEN}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

//Signal one entity as unidentified user

describe('POST api/moderation/report', () => {
    it('should return 401', async () => {
        const response = await request(app).post('/api/moderation/report').send({
            entityId: '1',
            entityType: 0,
            reason: 'Raison'
        });
        expect(response.status).toBe(401);
    });
});

//Signal one entity as identified user

describe('POST api/moderation/report', () => {
    it('should return 200', async () => {
        const response = await request(app).post('/api/moderation/report').send({
            entityId: process.env.ARGUMENT_ID,
            entityType: 0,
            reason: 'Raison'
        }).set('Authorization', `${process.env.USER_TOKEN}`);
        expect(response.status).toBe(200);
        process.env.FIRST_REPORT_ID = response.body.id;
    });
});

//After adding one reports, the number of reports should be 1
//Moderator 1, Moderator 2 and Admin can see it

//Admins can get the list of reports, and the number of reports should be 1, and the number of events of the report should be 1
describe('GET api/moderation/report', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/api/moderation/reports').set('Authorization', `${process.env.ADMIN_TOKEN}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].entityId).toBe(process.env.ARGUMENT_ID);
    });
});

//Getting the first report
describe('GET api/moderation/report/id after report', () => {
    it('should return 200', async () => {
        const response = await request(app).get(`/api/moderation/reports/${process.env.FIRST_REPORT_ID}`).set('Authorization', `${process.env.ADMIN_TOKEN}`);
        expect(response.status).toBe(200);
        expect(response.body.entityId).toBe(process.env.ARGUMENT_ID);
        expect(response.body.events.length).toBe(1);
        expect(response.body.events[0].reason).toBe('Raison');
    });
});

//Report the same entity again as someone else
describe('POST api/moderation/report', () => {
    it('should return 200', async () => {
        const response = await request(app).post('/api/moderation/report').send({
            entityId: process.env.ARGUMENT_ID,
            entityType: 0,
            reason: 'Raison2'
        }).set('Authorization', `${process.env.MODERATOR1_TOKEN}`);
        expect(response.status).toBe(200);
        process.env.SECOND_REPORT_ID = response.body.id;
    });
});

//the first report should have 2 events
describe('GET api/moderation/report/id after 2 reports', () => {
    it('should return 200', async () => {
        const response = await request(app).get(`/api/moderation/reports/${process.env.FIRST_REPORT_ID}`).set('Authorization', `${process.env.ADMIN_TOKEN}`);
        expect(response.status).toBe(200);
        expect(response.body.entityId).toBe(process.env.ARGUMENT_ID);
        expect(response.body.events.length).toBe(2);
    });
});


//--------------------------------------------------------
//Moderation as Admin 
//--------------------------------------------------------

//Basic rules, he can add an admin with an email
//He can promote a mod1 to mod2
//He can demote a mod2 to mod1
//He can delete a mod2
//He can delete a mod1


//--------------------------------------------------------
//Moderation as Mod1
//--------------------------------------------------------

//He can get the list of reports
//He can get a report
//He can ignore a report
//He can mask an entity

//--------------------------------------------------------
//Moderation as Mod2
//--------------------------------------------------------

//He can get the list of reports    
//He can get the list of hot reports
//He can get the activity of a specific moderator
//He can get the history of all recent signaling, with associated actions


//--------------------------------------------------------
//Moderation as User
//--------------------------------------------------------

//He can signal an entity
//He can get the list of his reports
//He can contest a report