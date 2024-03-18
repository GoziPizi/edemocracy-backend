import swaggerAutogen from 'swagger-autogen';
import { UserCreateInputDefinition, UserOutputDefinition, UserPublicOutputDefinition, UserUpdateInputDefinition } from './swagger/UserDefinition';
import { TopicOutputDefinition } from './swagger/TopicDefinition';
import { PartyCreateInputDefinition } from './swagger/PartyDefinition';

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
        },

        //Topic Router Definitions
        TopicOutputDefinition: TopicOutputDefinition,

        //Party Router Definitions
        PartyCreateInputDtoDefinition: PartyCreateInputDefinition
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/router/Router.ts']

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);