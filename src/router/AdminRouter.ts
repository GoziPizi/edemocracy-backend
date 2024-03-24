import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import BanWordService from '@/services/BanWordService';
import express, { NextFunction, Request, Response } from 'express'

const AdminRouter = express.Router();

AdminRouter.get('/banwords', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Utils']
        #swagger.description = 'Get the list of banned words'
        #swagger.responses[200] = {
            description: 'Banned words found',
            schema: { $ref: "#/definitions/BanWordOutputDefinition" }
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN') {
            throw new Error('You are not allowed to see this');
        }
        const banWords = await BanWordService.getBanWords();
        res.status(200).send(banWords);
    } catch (error) {
        console.log(error);
    }
});

AdminRouter.delete('/banwords/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Utils']
        #swagger.description = 'Delete a banned word'
        #swagger.parameters['id'] = {
            description: 'Banned word id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Banned word deleted',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN') {
            throw new Error('You are not allowed to see this');
        }
        await BanWordService.deleteBanWord(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

AdminRouter.post('/banwords', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Utils']
        #swagger.description = 'Create a banned word'
        #swagger.parameters['word'] = {
            description: 'Word to ban',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Banned word created',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN') {
            throw new Error('You are not allowed to see this');
        }
        await BanWordService.createBanWord(req.body.word);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

export default AdminRouter;