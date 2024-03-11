import AuthentificationService from '@/services/AuthentificationService';
import express, { NextFunction, Request, Response } from 'express'

const LoginRouter = express.Router();

LoginRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
    #swagger.tags = ['Login']
    #swagger.summary = 'Endpoint to login'
    #swagger.parameters['body] = {
        description: 'password and email',
        required: true,
        schema: { $ref: "#/definitions/LoginPasswordDefinition" }
    }
     */
    try {
        const { email, password } = req.body;
        const jwt = await AuthentificationService.login(email, password);
        res.status(200).send(jwt);
    } catch (error) {
        next(error);
    }
});

LoginRouter.post('/check', async (req: Request, res: Response, next: NextFunction) => {
    /**
    #swagger.tags = ['Login']
    #swagger.summary = 'Endpoint to check if token is valid'
    #swagger.parameters['body] = {
        description: 'token',
        required: true,
        schema: { $ref: "#/definitions/TokenDefinition" }
    }
     */
    try {
        const { token } = req.body;
        const isValid = await AuthentificationService.checkToken(token);
        res.status(200).send(isValid);
    } catch (error) {
        next(error);
    }
});

export default LoginRouter;