import express from 'express';

const UserRouter = express.Router();

UserRouter.post('/', async (req, res) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Create a new user'
        #swagger.parameters['body'] = {
            description: 'User information',
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
    //TODO
    //Accessible seulement si l'on est l'utilisateur ou admin
    try {
        //TODO
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

UserRouter.get('/:id/public', async (req, res) => {
    //TODO
    //Accessible si connecté
    try {
        //TODO
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

UserRouter.put('/:id', async (req, res) => {
    //TODO
    //Accessible seulement si l'on est l'utilisateur ou admin
    try {
        //TODO
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

export default UserRouter;