import express from 'express';

const UserRouter = express.Router();

UserRouter.post('/', async (req, res) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Create a new user'
        #swagger.parameters['body'] = {
            description: 'User information',
            required: true,
            schema: { $ref: "#/definitions/UserCreateInputDtoDefinition" }
        }
        #swagger.responses[201] = {
            description: 'User created',
        }
    */
    try {
        //TODO
        res.status(201)
    } catch (error) {
        console.log(error);
    }
});

UserRouter.get('/:id', async (req, res) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get user by id'
        #swagger.parameters['id'] = { description: 'User id', required: true }
        #swagger.responses[200] = {
            description: 'User found',
            schema: { $ref: "#/definitions/UserOutputDefinition" }
        }
     */
    try {
        //TODO
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

UserRouter.get('/:id/public', async (req, res) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get public user by id'
        #swagger.parameters['id'] = { description: 'User id', required: true }
        #swagger.responses[200] = {
            description: 'User found',
            schema: { $ref: "#/definitions/UserPublicOutputDefinition" }
        }
     */
    try {
        //TODO
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

UserRouter.put('/:id', async (req, res) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Update user by id'
        #swagger.parameters['id'] = { description: 'User id', required: true }
        #swagger.parameters['body'] = {
            description: 'User information',
            required: true,
            schema: { $ref: "#/definitions/UserUpdateInputDefinition" }
        }
        #swagger.responses[200] = {
            description: 'User updated',
            schema: { $ref: "#/definitions/UserOutputDefinition" }
        }
     */
    try {
        //TODO
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

export default UserRouter;