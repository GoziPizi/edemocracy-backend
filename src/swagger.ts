import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'E-Democracy Swagger',
        description: 'Swagger for E-Democracy API',
    },
    servers:[
        {
            url: 'http://localhost:8080'
        }
    ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/router/Router.ts']

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);