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

TopicRouter.get('/:id', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

TopicRouter.get('/:id/children', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

export default TopicRouter;