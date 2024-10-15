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
        const data = await fs.readFile('src/utils/presentation/presentation', 'utf8');
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
        const data = await fs.readFile('src/utils/presentation/founder', 'utf8');
        res.status(200).send({content: data});
    } catch (error) {
        next(error);
    }
});

export default PresentationRouter;