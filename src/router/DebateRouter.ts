import { authMiddleware } from '@/checkAuthMiddleware';
import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import BanWordService from '@/services/BanWordService';
import DebateService from '@/services/DebateService';
import { DebateVoteType } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';

const DebateRouter = express.Router();

DebateRouter.get('/by-time', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get debates by time.'
        #swagger.parameters['query'] = {
            limit: 10
        }
        #swagger.responses[200] = {
            description: 'Debates found',
            schema: { $ref: "#/definitions/DebateOutputDefinition" }
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {
        const limit = Number(req.query.limit) || 10;
        const debates = await DebateService.getDebatesByTime(limit);
        res.status(200).send(debates);
    } catch (error) {
        next(error);
    }
});

DebateRouter.get('/by-popularity', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get debates by popularity.'
        #swagger.parameters['query'] = {
            limit: 10
        }
        #swagger.responses[200] = {
            description: 'Debates found',
            schema: { $ref: "#/definitions/DebateOutputDefinition" }
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {
        const limit = Number(req.query.limit) || 10;
        const debates = await DebateService.getDebatesByPopularity(limit);
        res.status(200).send(debates);
    } catch (error) {
        next(error);
    }
});

DebateRouter.get('/trending/:page', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get trending debates.'
        #swagger.parameters['path'] = {
            page: 1
        }
        #swagger.responses[200] = {
            description: 'Debates found',
            schema: { $ref: "#/definitions/DebateOutputDefinition" }
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    //Returns MediaDebates
    //Pages start at 1
    try {
        const page = Number(req.params.page);
        const debates = await DebateService.getTrendingDebatesThumbnails(page);
        res.status(200).send(debates);
    } catch (error) {
        next(error);
    }
});

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
        let userId = null;
        if(token && token !== null && token !== 'null' && token !== 'undefined' && token !== undefined) {
            await AuthentificationService.checkToken(token);
            userId = AuthentificationService.getUserId(token);
        }
        const id = String(req.params.id);
        let debate;
        if(userId) {
            debate = await DebateService.getDebateWithUserVote(id, userId);
        } else {
            debate = await DebateService.getDebateById(id);
        }
        res.status(200).send(debate);
    } catch (error) {
        next(error);
    }
});

DebateRouter.post('/',authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
        const userId = AuthentificationService.getUserId(token);
        const debate = req.body;

        //Check for ban words
        await BanWordService.checkStringForBanWords(debate.title)
        await BanWordService.checkStringForBanWords(debate.content)

        const createdDebate = await DebateService.createDebate(debate, userId);
        res.status(200).send(createdDebate);
    } catch (error:any) {
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
        let userId = null;
        if(token && token !== null && token !== 'null' && token !== 'undefined' && token !== undefined) {
            await AuthentificationService.checkToken(token);
            userId = AuthentificationService.getUserId(token);
        }
        const id = String(req.params.id);
        let debateArguments;
        if(userId) {
            debateArguments = await DebateService.getDebateArgumentsWithVote(id, userId);
        } else {
            debateArguments = await DebateService.getDebateArguments(id);
        }
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

DebateRouter.get('/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get the vote of the user for a debate.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.responses[200] = {
            description: 'Vote found',
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
        const userId = AuthentificationService.getUserId(token);
        const vote = await DebateService.getDebateVote(id, userId);
        res.status(200).send(vote);
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

DebateRouter.post('/:debateId/reformulations',authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to reformulate a debate.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.parameters['formData'] = {
            title: 'Nouveau titre',
            description: 'Nouvelle description'
        }
        #swagger.responses[200] = {
            description: 'Debate reformulated'
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
        const userId = AuthentificationService.getUserId(token);
        const debateId = String(req.params.debateId);
        const reformulation = req.body;

        await BanWordService.checkStringForBanWords(reformulation.title)
        await BanWordService.checkStringForBanWords(reformulation.content)
        
        await DebateService.createDebateReformulation({debateId, ...reformulation, userId});
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

DebateRouter.get('/:id/reformulations', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get a debate reformulation by its id.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.responses[200] = {
            description: 'Reformulation found',
            schema: { $ref: "#/definitions/DebateOutputDefinition" }
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {
        const id = String(req.params.id);
        const reformulation = await DebateService.getDebateReformulations(id);
        res.status(200).send(reformulation);
    } catch (error) {
        next(error);
    }
});

DebateRouter.get('/reformulations/:reformulationId/vote', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get the vote of the user for a debate reformulation.'
        #swagger.parameters['path'] = {
            id: 1,
            reformulationId: 1
        }
        #swagger.responses[200] = {
            description: 'Vote found',
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
        const reformulationId = String(req.params.reformulationId);
        const userId = AuthentificationService.getUserId(token);
        const vote = await DebateService.getReformulationVote(reformulationId, userId);
        res.status(200).send(vote);
    } catch (error) {
        next(error);
    }
});

DebateRouter.get('/reformulations/:reformulationId', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to get a debate reformulation by its id.'
        #swagger.parameters['path'] = {
            id: 1,
            reformulationId: 1
        }
        #swagger.responses[200] = {
            description: 'Reformulation found',
            schema: { $ref: "#/definitions/DebateOutputDefinition" }
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {
        const reformulationId = String(req.params.reformulationId);
        const reformulation = await DebateService.getReformulationById(reformulationId);
        res.status(200).send(reformulation);
    } catch (error) {
        next(error);
    }
});

DebateRouter.post('/reformulations/:reformulationId/vote',authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Debate']
        #swagger.summary = 'Endpoint to vote for a debate reformulation.'
        #swagger.parameters['path'] = {
            id: 1,
            reformulationId: 1
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
        const reformulationId = String(req.params.reformulationId);
        const value = req.body.value as boolean | null;
        const userId = AuthentificationService.getUserId(token);
        await DebateService.voteForReformulation(reformulationId, userId, value);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

export default DebateRouter;