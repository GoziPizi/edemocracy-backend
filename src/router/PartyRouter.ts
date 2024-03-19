import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import PartyService from '@/services/PartyService';
import { PartyCreateInput } from '@/types/dtos/PartyDto';
import express, { NextFunction, Request, Response } from 'express';

const PartyRouter = express.Router();

PartyRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to create a party'
        #swagger.parameters['body'] = {
            description: 'Party to create',
            required: true,
            schema: { $ref: "#/definitions/PartyCreateInputDtoDefinition" }
        }
        #swagger.responses[201] = {
            description: 'Party created',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const party: PartyCreateInput = req.body;
        const createdParty = await PartyService.createParty(party, userId);
        res.status(201).send(createdParty);
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.post('/search', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Party', 'Search']
        #swagger.description = 'Endpoint to search some parties'
        #swagger.parameters['body'] = {
            description: 'criterias to search',
            required: true,
        }
        #swagger.responses[201] = {
            description: 'List of the parties found',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const result = await PartyService.searchParty(req.body);
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.get('/:id', async (req, res) => {
    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to get a party by its id'
        #swagger.parameters['id'] = { description: 'Party id', required: true }
        #swagger.responses[200] = {
            description: 'Party found',
            schema: { $ref: "#/definitions/PartyOutputDtoDefinition" }
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const party = await PartyService.getPartyById(req.params.id);
        res.status(200).send(party);
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.get('/:id/private-infos', async (req, res) => {
    //TODO
    try {
        //TODO
        //Accessible seulement si l'on est membre du parti ou admin du parti
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.get('/:id/check-admin', async (req, res) => {
    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to check if the token has admin rights on the party'
        #swagger.parameters['id'] = { description: 'Party id', required: true }
        #swagger.responses[200] = {
            description: 'Token has admin rights on the party',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const hasAdminRights = await PartyService.checkAdminRights(req.params.id, userId);
        res.status(200).send(hasAdminRights);
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to update a party'
        #swagger.parameters['id'] = { description: 'Party id', required: true }
        #swagger.parameters['body'] = {
            description: 'Party to update',
            required: true,
        }
        #swagger.responses[200] = {
            description: 'Party updated',
        }
     
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const party: PartyCreateInput = req.body;
        const updatedParty = await PartyService.updateParty(req.params.id, party, userId);
        res.status(200).send(updatedParty);
    } catch (error) {
        next(error);
    }
});

export default PartyRouter;