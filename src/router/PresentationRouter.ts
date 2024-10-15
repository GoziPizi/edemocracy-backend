import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import express, { NextFunction, Request, Response } from 'express';
import { promises as fs } from 'fs';

const PresentationRouter = express.Router();

PresentationRouter.get('/main-presentation', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Presentation']
        #swagger.description = 'Endpoint to get the main presentation'
        #swagger.responses[200] = {
            description: 'Main presentation found',
        }
     */
    try {
        const data = await fs.readFile('src/utils/presentation/presentation', 'utf-8');
        res.status(200).send({content: data});
    } catch (error) {
        next(error);
    }
});

PresentationRouter.get('/founder', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Presentation']
        #swagger.description = 'Endpoint to get the founder presentation'
        #swagger.responses[200] = {
            description: 'Founder presentation found',
        }
     */
    try {
        const data = await fs.readFile('src/utils/presentation/founder', 'utf-8');
        res.status(200).send({content: data});
    } catch (error) {
        next(error);
    }
});

PresentationRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Presentation']
        #swagger.description = 'Endpoint to update the main presentation'
        #swagger.parameters['content'] = { description: 'Main presentation content' }
        #swagger.responses[200] = {
            description: 'Main presentation updated',
        }
     */
    try {
        //Check if the user is an admin
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN') {
            throw new Error('You are not allowed to do this');
        }
        const presentation = req.body.presentation;
        const founder = req.body.founder;
        await fs.writeFile('src/utils/presentation/presentation', presentation);
        await fs.writeFile('src/utils/presentation/founder', founder);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

export default PresentationRouter;