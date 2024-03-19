import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import TopicService from '@/services/TopicService';
import express, { NextFunction, Request, Response } from 'express';

const TopicRouter = express.Router();

TopicRouter.post('/', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(201)
    } catch (error) {
        console.log(error);
    }
});

TopicRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Topic']
        #swagger.summary = 'Endpoint to get topics.'
        #swagger.parameters['query'] = {
            page: 1
        }
        #swagger.responses[200] = {
            description: 'Topics found',
            schema: { $ref: "#/definitions/TopicOutputDefinition" }
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
        const page = Number(req.query.page) || 1;
        const topics = await TopicService.getTopics(page)
        res.status(200).send(topics);
    } catch (error) {
        next(error);
    }
});

TopicRouter.get('/parentlist', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Topic']
        #swagger.summary = 'Endpoint to get parent topics, as a list of name-ids.'
        #swagger.responses[200] = {
            description: 'Returned the list',
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
        const topics = await TopicService.getParentsList();
        res.status(200).send(topics);
    } catch (error) {
        next(error);
    }
});

TopicRouter.get('/fulllist', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Topic']
        #swagger.summary = 'Endpoint to get all topics, as a list of name-ids.'
        #swagger.responses[200] = {
            description: 'Returned the list',
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
        const topics = await TopicService.getFullList();
        res.status(200).send(topics);
    } catch (error) {
        next(error);
    }
});

TopicRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Topic']
        #swagger.summary = 'Endpoint to get a topic by its id.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.responses[200] = {
            description: 'Topic found',
            schema: { $ref: "#/definitions/TopicOutputDefinition" }
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
        const topic = await TopicService.getTopicById(id);
        res.status(200).send(topic);
    } catch (error) {
        next(error);
    }
});

TopicRouter.get('/:id/debates', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Topic']
        #swagger.summary = 'Endpoint to get debates of a topic by its id.'
        #swagger.parameters['path'] = {
            id: 1
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
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const id = String(req.params.id);
        const debates = await TopicService.getDebatesByTopicId(id);
        res.status(200).send(debates);
    } catch (error) {
        next(error);
    }
});

export default TopicRouter;