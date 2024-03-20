import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import DebateService from '@/services/DebateService';
import { DebateVoteType } from '@prisma/client';
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
        const userId = AuthentificationService.getUserId(token);
        const id = String(req.params.id);
        const debate = await DebateService.getDebateWithUserVote(id, userId);
        res.status(200).send(debate);
    } catch (error) {
        next(error);
    }
});

DebateRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to create a debate.'
        #swagger.parameters['formData'] = {
        }
        #swagger.responses[200] = {
            description: 'Debate created'
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
        const debate = req.body as string;
        const createdDebate = await DebateService.createDebate(debate);
        res.status(200).send(createdDebate);
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

DebateRouter.post('/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to vote for a debate.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.parameters['formData'] = {
            value: 1
        }
        #swagger.responses[200] = {
            description: 'Vote registered'
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
        const id = String(req.params.id);
        const value = req.body.value as DebateVoteType;
        const userId = AuthentificationService.getUserId(token);
        await DebateService.voteForDebate(id, userId, value);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

DebateRouter.delete('/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to delete a vote for a debate.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.responses[200] = {
            description: 'Vote deleted'
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
        const id = String(req.params.id);
        const userId = AuthentificationService.getUserId(token);
        await DebateService.deleteVoteForDebate(id, userId);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

export default DebateRouter;