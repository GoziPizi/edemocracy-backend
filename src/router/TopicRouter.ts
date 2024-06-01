import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import BanWordService from '@/services/BanWordService';
import TopicService from '@/services/TopicService';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const TopicRouter = express.Router();

TopicRouter.post(
    '/',
    upload.fields([{ name: 'image', maxCount: 1}]),
    async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Topic']
        #swagger.summary = 'Endpoint to create a new topic.'
        #swagger.parameters['body'] = {
            title: "Title",
            description: "Description",
            parentTopicId: 1
        }
        #swagger.responses[201] = {
            description: 'Topic created',
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const image = files['image'] ? files['image'][0] : undefined;

        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const isVerified = AuthentificationService.checkVerified(token);
        if(!isVerified) {
            throw new Error('User not verified');
        }
        await AuthentificationService.checkToken(token);

        const topic = req.body;
        await BanWordService.checkStringForBanWords(topic.title)
        await BanWordService.checkStringForBanWords(topic.description)

        const newTopic = await TopicService.createTopic(topic, image);
        res.status(201).send(newTopic);
    } catch (error) {
        next(error);
    }
});

TopicRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Topic']
        #swagger.summary = 'Endpoint to update a topic by its id.'
        #swagger.parameters['path'] = {
            id: 1
        }
        #swagger.parameters['body'] = {
            title: "Title",
            description: "Description",
            parentTopicId: 1
        }
        #swagger.responses[200] = {
            description: 'Topic updated',
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
        const userId = AuthentificationService.getUserId(token)

        const id = String(req.params.id);
        const topic = req.body;
        await BanWordService.checkStringForBanWords(topic.title)
        await BanWordService.checkStringForBanWords(topic.description)

        const updatedTopic = await TopicService.updateTopic(id, topic, userId);
        res.status(200).send(updatedTopic);
    } catch (error) {
        next(error);
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
        const topics = await TopicService.getFullList();
        res.status(200).send(topics);
    } catch (error) {
        next(error);
    }
});

TopicRouter.get('/recent', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Topic']
        #swagger.summary = 'Endpoint to get the most recent topics.'
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
        const topics = await TopicService.getRecentTopics()
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
        const id = String(req.params.id);
        const debates = await TopicService.getDebatesByTopicId(id);
        res.status(200).send(debates);
    } catch (error) {
        next(error);
    }
});

export default TopicRouter;