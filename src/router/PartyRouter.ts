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

//get members list
PartyRouter.get('/:id/members', async (req, res) => {
    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to get the members of a party'
        #swagger.parameters['id'] = { description: 'Party id', required: true }
        #swagger.responses[200] = {
            description: 'List of the members',
            schema: { $ref: "#/definitions/PartyMembersOutputDtoDefinition" }
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const members = await PartyService.getMembers(req.params.id);
        res.status(200).send(members);
    } catch (error) {
        console.log(error);
    }
});

PartyRouter.post('/:id/members/invite', async (req: Request, res: Response, next: NextFunction) => {

    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to add a member to a party, can only be used by admins of the party'
        #swagger.parameters['id'] = { description: 'Party id', required: true }
        #swagger.responses[201] = {
            description: 'User joined the party',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const id = req.params.id;
        const newMemberEmail = req.body.email;
        const invitation = await PartyService.inviteMember(id, userId, newMemberEmail);
        res.status(201).send(invitation);
    } catch (error) {
        next(error);
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

PartyRouter.get('/:id/history', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to get the history of a party'
        #swagger.parameters['id'] = { description: 'Party id', required: true }
        #swagger.responses[200] = {
            description: 'History of the party',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const history = await PartyService.getAllPartyHistoryEventsFromPartyId(req.params.id);
        res.status(200).send(history);
    } catch (error) {
        next(error);
    }
});

PartyRouter.post('/:id/history', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to add a history event to a party'
        #swagger.parameters['id'] = { description: 'Party id', required: true }
        #swagger.parameters['body'] = {
            description: 'History event to add',
            required: true,
            schema: {
                title: 'Titre',
                content: 'Contenu',
                dateStart: '2021-01-01T00:00:00.000Z',
                dateEnd: '2021-01-01T00:00:00.000Z',
            }
        }
        #swagger.responses[201] = {
            description: 'History event added',
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
        if(!hasAdminRights) {
            throw new Error('You are not allowed to do this');
        }
        const history = await PartyService.createPartyHistoryEvent(req.params.id, req.body);
        res.status(201).send(history);
    } catch (error) {
        next(error);
    }
});

PartyRouter.delete('/:id/history/:historyId', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Party']
        #swagger.description = 'Endpoint to delete a party history event'
        #swagger.parameters['id'] = { description: 'Party id', required: true }
        #swagger.parameters['historyId'] = { description: 'History event id', required: true }
        #swagger.responses[200] = {
            description: 'History event deleted',
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
        if(!hasAdminRights) {
            throw new Error('You are not allowed to do this');
        }
        await PartyService.deletePartyHistoryEvent(req.params.historyId);
        res.status(200).send();
    } catch (error) {
        next(error);
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