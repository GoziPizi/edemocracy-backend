import request from 'supertest';
import app from '../../src/index';

//Get reports as unidentified user

describe('GET /moderation/reports', () => {
    it('should return 401', async () => {
        const response = await request(app).get('/api/moderation/reports');
        expect(response.status).toBe(401);
    });
});

//Get reports as identified user

//Get reports as moderator 1

//Get reports as moderator 2

//Get reports as admin