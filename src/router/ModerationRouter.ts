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

//ignore report
ModerationRouter.delete('/reports/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Ignore a report'
        #swagger.parameters['id'] = {
            description: 'Report id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Report ignored',
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
        await ModerationService.ignoreReport(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

//delete reports entity
ModerationRouter.delete('/reports/:id/delete-entity', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Delete the entity linked to a report'
        #swagger.parameters['id'] = {
            description: 'Report id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Entity deleted',
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
        await ModerationService.deleteEntity(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

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