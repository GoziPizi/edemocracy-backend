import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import PartyInvitationService from '@/services/PartyInvitationService';
import express, { NextFunction, Request, Response } from 'express';

const PartyInvitationRouter = express.Router();

PartyInvitationRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['PartyInvitation']
        #swagger.description = 'Endpoint to get all party invitations, only accessible by the user who received the invitations.'
        #swagger.responses[200] = {
            description: 'List of party invitations found',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const partyInvitations = await PartyInvitationService.getPartyInvitationsByUserId(userId);
        res.status(200).send(partyInvitations);
    } catch (error) {
        console.log(error);
    }
});

PartyInvitationRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['PartyInvitation']
        #swagger.description = 'Endpoint to get a party invitation, only accessible by the user who received the invitation.'
        #swagger.parameters['id'] = { description: 'Party invitation id', required: true }
        #swagger.responses[200] = {
            description: 'Party invitation found',
        }
        #swagger.responses[404] = {
            description: 'Party invitation not found',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const partyInvitation = await PartyInvitationService.getPartyInvitationById(req.params.id, userId);
        res.status(200).send(partyInvitation);
    } catch (error) {
        console.log(error);
    }
});

export default PartyInvitationRouter;