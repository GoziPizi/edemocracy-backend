import AuthentificationService from '@/services/AuthentificationService';
import express, { NextFunction, Request, Response } from 'express'
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

LoginRouter.post(
    '/register',
    upload.fields([{name: 'recto', maxCount: 1}, {name: 'verso', maxCount: 1}]),
    async (req: Request, res: Response, next: NextFunction) => {
    /**
    #swagger.tags = ['Login', 'Register']
    #swagger.summary = 'Endpoint to register an account'
    #swagger.parameters['body] = {
        description: 'password and email',
        required: true,
        schema: { $ref: "#/definitions/LoginPasswordDefinition" }
    }
     */
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const recto = files['recto'] ? files['recto'][0] : undefined;
        const verso = files['verso'] ? files['verso'][0] : undefined;
        if(!recto || !verso) {
            throw new Error('Recto and verso are required');
        }
        const userInput = req.body;
        const jwt = await AuthentificationService.register(userInput, recto, verso);
        res.status(200).send(jwt);
    } catch (error) {
        next(error);
    }
});

export default LoginRouter;