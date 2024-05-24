import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import ArgumentService from '@/services/ArgumentService';
import AuthentificationService from '@/services/AuthentificationService';
import { ArgumentType } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';

const ArgumentRouter = express.Router();

ArgumentRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Argument']
        #swagger.summary = 'Endpoint to create an argument.'
        #swagger.parameters['body'] = {
            text: "This is a test argument"
        }
        #swagger.responses[200] = {
            description: 'Argument created'
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
        const isVerified = AuthentificationService.checkVerified(token);
        if(!isVerified) {
            throw new Error('User not verified');
        }
        const userId = AuthentificationService.getUserId(token);
        const { content, argumentType, debateId } = req.body;
        await ArgumentService.createArgument(content, argumentType as ArgumentType, userId, debateId);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

ArgumentRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Argument']
        #swagger.summary = 'Endpoint to get an argument by its id.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.responses[200] = {
            description: 'Argument found',
            schema: { $ref: "#/definitions/ArgumentWithVoteOutputDefinition" }
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
        const argument = await ArgumentService.getArgumentById(id, userId);
        res.status(200).send(argument);
    } catch (error) {
        next(error);
    }
});

ArgumentRouter.post('/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Argument']
        #swagger.summary = 'Endpoint to vote for an argument.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.parameters['body'] = {
            value: true
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
        await AuthentificationService.checkToken(token);
        const isVerified = AuthentificationService.checkVerified(token);
        if(!isVerified) {
            throw new Error('User not verified');
        }
        const userId = AuthentificationService.getUserId(token);
        const id = String(req.params.id);
        const value = Boolean(req.body.value);
        await ArgumentService.voteForArgument(id, userId, value);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

ArgumentRouter.delete('/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Argument']
        #swagger.summary = 'Endpoint to delete a vote for an argument.'
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
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const id = String(req.params.id);
        await ArgumentService.deleteVoteForArgument(id, userId);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

export default ArgumentRouter;