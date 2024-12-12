import request from 'supertest';
import app from '../../src/index';

//-------------------------------------------------------------
//FREE SECTION

//Register with valid data
describe('Basic registration with valid data', () => {
    it('should register and return a valid token', async () => {
    const data = {
        firstName: 'John',
        name: 'Doe',
        politicSide: 'LEFT',
        address: '1 rue de la Paix, Paris',
        postalCode: '75000',
        city: 'Paris',
        telephone: '0123456789',
        email: 'John.doe@test.com',
        password: 'password',
    }
    const response = await request(app).post('/api/login/register-free').send(data);
    expect(response.status).toBe(200);
    })
});

//Try with already taken email

describe('Basic registration with valid data, but the same email', () => {
    it('should register and return a valid token', async () => {
    const data = {
        firstName: 'John',
        name: 'Doe',
        politicSide: 'LEFT',
        address: '1 rue de la Paix, Paris',
        postalCode: '75000',
        city: 'Paris',
        telephone: '0123456789',
        email: 'John.doe@test.com',
        password: 'password',
    }
    const response = await request(app).post('/api/login/register-free').send(data);
    expect(response.status).toBe(400);
    })
});

//Diplomas

describe('Basic registration with valid data and diplomas', () => {
    it('should register and return a valid token', async () => {
    const data = {
        firstName: 'John',
        name: 'Doe',
        politicSide: 'LEFT',
        address: '1 rue de la Paix, Paris',
        postalCode: '75000',
        city: 'Paris',
        telephone: '0123456789',
        email: 'Johndoe2@test.com',
        password: 'password',
        diplomas: JSON.stringify([
            {
                name: 'BAC',
                obtention: 2010
            },
            {
                name: 'BTS',
                obtention: 2012
            }
        ])
    }
    const response = await request(app).post('/api/login/register-free').send(data);
    expect(response.status).toBe(200);
    });
});

//Try with invalid diplomas
describe('Basic registration with valid data and invalid diplomas', () => {
    it('should register and return a valid token', async () => {
    const data = {
        firstName: 'John',
        name: 'Doe',
        politicSide: 'LEFT',
        address: '1 rue de la Paix, Paris',
        postalCode: '75000',
        city: 'Paris',
        telephone: '0123456789',
        email: 'Johndoe2@test.com',
        password: 'password',
        diplomas: JSON.stringify([
            {
                name: 'BAC',
            },
            {
                name: 'BTS',
                obtention: 2012
            },
            {
                name: 'BTS',
                obtention: 2012
            }
        ])
    }
    const response = await request(app).post('/api/login/register-free').send(data);
    expect(response.status).toBe(400);
    });
});

//Try withgood input 
//Try with invalid input

//-------------------------------------------------------------
//STANDARD SECTION