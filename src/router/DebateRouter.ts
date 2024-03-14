import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import DebateService from '@/services/DebateService';
import express, { NextFunction, Request, Response } from 'express';

const DebateRouter = express.Router();

DebateRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get a debate by its id.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.responses[200] = {
            description: 'Debate found',
            schema: { $ref: "#/definitions/DebateOutputDefinition" }
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const id = String(req.params.id);
        const debate = await DebateService.getDebateById(id);
        res.status(200).send(debate);
    } catch (error) {
        next(error);
    }
});

DebateRouter.get('/:id/arguments', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get a debate arguments by its id.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.responses[200] = {
            description: 'Arguments found',
            schema: { $ref: "#/definitions/ArgumentOutputDefinition" }
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const id = String(req.params.id);
        const debateArguments = await DebateService.getDebateArguments(id, token);
        res.status(200).send(debateArguments);
    } catch (error) {
        next(error);
    }
});

export default DebateRouter;