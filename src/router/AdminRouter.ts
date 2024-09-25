import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import BanWordService from '@/services/BanWordService';
import SponsorshipService from '@/services/SponsorshipService';
import { Role } from '@prisma/client';
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

AdminRouter.get('/admins', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Utils']
        #swagger.description = 'Get the list of admins'
        #swagger.responses[200] = {
            description: 'Admins found',
            schema: { $ref: "#/definitions/AdminOutputDefinition" }
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
        const admins = await AuthentificationService.getAdmins();
        res.status(200).send(admins);
    } catch (error) {
        console.log(error);
    }
});

AdminRouter.post('/admins', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Utils']
        #swagger.description = 'Create an admin'
        #swagger.responses[200] = {
            description: 'Admin created',
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
        const userEmailToPromote = req.body.email;
        await AuthentificationService.setRoleToUserByEmail(userEmailToPromote, Role.ADMIN);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
})

AdminRouter.delete('/admins/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Utils']
        #swagger.description = 'Delete an admin'
        #swagger.parameters['id'] = {
            description: 'Admin id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Admin deleted',
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
        const userIdToPromote = req.params.id;
        await AuthentificationService.setRoleToUser(userIdToPromote, Role.USER);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
})

AdminRouter.get('/verifications-request', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Utils']
        #swagger.description = 'Get the list of the users who are waiting for verification'
        #swagger.responses[200] = {
            description: 'Users found',
            schema: { $ref: "#/definitions/VerificationRequestOutputDefinition" }
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
        const requests = await AuthentificationService.getVerificationRequests();
        res.status(200).send(requests);
    } catch (error) {
        console.log(error);
    }
});

AdminRouter.post('/verifications-request/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Utils']
        #swagger.description = 'Accept a user verification request'
        #swagger.parameters['id'] = {
            description: 'User id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'User verified',
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
        const requestId = req.params.id;
        await AuthentificationService.acceptVerificationRequest(requestId, req.body.verified);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }

});

AdminRouter.get('/non-empty-jackpots', async (req: Request, res: Response, next: NextFunction) => {

    //Retufn all the jackpots that are not empty

    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN') {
            throw new Error('You are not allowed to see this');
        }
        const requests = await SponsorshipService.adminGetNonEmptyJackpots();
        res.status(200).send(requests);
    } catch (error) {
        console.log(error);
    }
});

AdminRouter.post('/confirm-payment/:id', async (req: Request, res: Response, next: NextFunction) => {
    //Called by the admin when he confirms to have paid the jackpot of the user.

    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN') {
            throw new Error('You are not allowed to see this');
        }

        const userId = req.params.userId;

        await SponsorshipService.adminConfirmJackpotPayment(userId);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

export default AdminRouter;