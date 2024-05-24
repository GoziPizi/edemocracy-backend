import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import PersonalityService from '@/services/PersonalityService';
import express, { NextFunction, Request, Response } from 'express';

const PersonalityRouter = express.Router();

PersonalityRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['Personality']
     * #swagger.description = 'Endpoint to create a personality'
     * #swagger.parameters['body'] = {
     *    in: 'body',
     *   description: 'Personality informations',
     *  required: true,
     * schema: { $ref: "#/definitions/Personality" }
    */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const isVerified = AuthentificationService.checkVerified(token);
        if(!isVerified) {
            throw new Error('User not verified');
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const result = await PersonalityService.createPersonality(userId);
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
    }
});

PersonalityRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Personality']
        #swagger.description = 'Endpoint to update a personality'
        #swagger.parameters['body'] = {
            description: 'Personality informations',
            required: true,
        }
        #swagger.responses[200] = {
            description: 'Personality updated',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const result = await PersonalityService.updatePersonalityFromUserId(userId, req.body);
        res.status(200).send(result);
    } catch (error) {
        next(error);
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
        next(error);
    }
});

PersonalityRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Personality']
        #swagger.description = 'Endpoint to get a personality'
        #swagger.parameters['id'] = { description: 'Personality id' }
        #swagger.responses[200] = {
            description: 'Personality found',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const result = await PersonalityService.getPersonality(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
});

PersonalityRouter.get('/:id/opinions', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Personality']
        #swagger.description = 'Endpoint to get the opinions of a personality'
        #swagger.parameters['id'] = { description: 'Personality id' }
        #swagger.responses[200] = {
            description: 'Opinions found',
        }
     */
    try {
        const result = await PersonalityService.getOpinions(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        next(error);
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

PersonalityRouter.put('/:id/description', async (req, res) => {
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