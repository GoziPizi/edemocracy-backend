import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import { ReportIntToReportType } from '@/mappers/ReportType';
import AuthentificationService from '@/services/AuthentificationService';
import ModerationService from '@/services/ModerationService';
import express, { NextFunction, Request, Response } from 'express'

const ModerationRouter = express.Router();

//signaler un truc

ModerationRouter.post('/report', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Report an entity'
        #swagger.parameters['entityId'] = {
            description: 'Entity id',
            required: true
        }
        #swagger.parameters['entityType'] = {
            description: 'Entity type',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Entity reported',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        console.log(req.body.entityId, req.body.entityType);
        await ModerationService.report(req.body.entityId, ReportIntToReportType(req.body.entityType));
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

//Recuperer les reports
ModerationRouter.get('/reports', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Get the list of reports'
        #swagger.responses[200] = {
            description: 'Reports found',
            schema: { $ref: "#/definitions/ReportOutputDefinition" }
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR') {
            throw new Error('You are not allowed to see this');
        }
        const reports = await ModerationService.getReports();
        res.status(200).send(reports);
    } catch (error) {
        console.log(error);
    }
});

//supprimer topic 

ModerationRouter.delete('/topic/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Delete a topic'
        #swagger.parameters['id'] = {
            description: 'Topic id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Topic deleted',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR') {
            throw new Error('You are not allowed to see this');
        }
        await ModerationService.deleteTopic(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

//supprimer commentaire

ModerationRouter.delete('/comment/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Delete a comment'
        #swagger.parameters['id'] = {
            description: 'Comment id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Comment deleted',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR') {
            throw new Error('You are not allowed to see this');
        }
        await ModerationService.deleteComment(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

//supprimer argument

ModerationRouter.delete('/argument/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Delete an argument'
        #swagger.parameters['id'] = {
            description: 'Argument id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Argument deleted',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR') {
            throw new Error('You are not allowed to see this');
        }
        await ModerationService.deleteArgument(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

//supprimer debat

ModerationRouter.delete('/debate/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Delete a debate'
        #swagger.parameters['id'] = {
            description: 'Debate id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Debate deleted',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR') {
            throw new Error('You are not allowed to see this');
        }
        await ModerationService.deleteDebate(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

//reformulation

ModerationRouter.delete('/reformulation/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Delete a reformulation'
        #swagger.parameters['id'] = {
            description: 'Reformulation id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Reformulation deleted',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR') {
            throw new Error('You are not allowed to see this');
        }
        await ModerationService.deleteReformulation(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

//ban user

ModerationRouter.delete('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Ban a user'
        #swagger.parameters['id'] = {
            description: 'User id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'User banned',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR') {
            throw new Error('You are not allowed to see this');
        }
        await ModerationService.banUser(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

export default ModerationRouter;