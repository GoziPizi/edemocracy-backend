import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import PersonalityService from '@/services/PersonalityService';
import express, { NextFunction, Request, Response } from 'express';

const PersonalityRouter = express.Router();

PersonalityRouter.post('/', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(201)
    } catch (error) {
        console.log(error);
    }
});

PersonalityRouter.post('/search', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Personality', Search]
        #swagger.description = 'Endpoint to search some personalities'
        #swagger.parameters['body'] = {
            description: 'criterias to search',
            required: true,
        }
        #swagger.responses[201] = {
            description: 'List of the personalities found',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const result = await PersonalityService.searchPersonality(req.body);
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
    }
});

PersonalityRouter.get('/:id', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible si connecté
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

PersonalityRouter.get('/:id/private-infos', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible seulement si l'on est la personalité
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

PersonalityRouter.put('/:id', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible seulement si l'on est la personalité
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

export default PersonalityRouter;