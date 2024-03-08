import express from 'express';

import UserService from '@/services/UserService';

const UserRouter = express.Router();

UserRouter.post('/', async (req, res) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
    }
});

export default UserRouter;