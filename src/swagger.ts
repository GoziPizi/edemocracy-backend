import swaggerAutogen from 'swagger-autogen';
import { UserCreateInputDefinition, UserOutputDefinition, UserPublicOutputDefinition, UserUpdateInputDefinition } from './swagger/UserDefinition';

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
    definitions: {
        //User Router Definitions
        UserCreateInputDtoDefinition: UserCreateInputDefinition,
        UserOutputDefinition: UserOutputDefinition,
        UserPublicOutputDefinition: UserPublicOutputDefinition,
        UserUpdateInputDefinition: UserUpdateInputDefinition,

        //Login Router Definitions
        LoginPasswordDefinition: {
            email: 'string',
            password: 'string'
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/router/Router.ts']

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);