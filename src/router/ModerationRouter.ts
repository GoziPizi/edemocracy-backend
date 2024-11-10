import { Forbidden } from '@/exceptions/AdminExceptions';
import { MissingArgumentException } from '@/exceptions/BaseExceptions';
import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import { ReportIntToReportType } from '@/mappers/ReportType';
import AuthentificationService from '@/services/AuthentificationService';
import ModerationService from '@/services/ModerationService';
import { ReportingType } from '@prisma/client';
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
        const entityType = ReportIntToReportType(req.body.entityType);
        const entityId = req.body.entityId;
        const reason = req.body.reason;

        if(!entityType || !entityId || !reason) {
            throw new MissingArgumentException('entityType, entityId or reason');
        }

        const userId = AuthentificationService.getUserId(token);
        const report = await ModerationService.report(userId, entityId, entityType as ReportingType, reason);
        res.status(200).send(report);
    } catch (error:any) {
        if (error instanceof JwtNotInHeaderException) {
            return res.status(401).json({error:'Unauthorized, token not found'});
        }
        return res.status(500).json({error: 'Internal server error'});
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
        if(role !== 'ADMIN' && role !== 'MODERATOR1' && role !== 'MODERATOR2') {
            throw new Forbidden();
        }
        const reports = await ModerationService.getReports();
        res.status(200).send(reports);
    } catch (error:any) {
        if (error instanceof JwtNotInHeaderException) {
            return res.status(401).json({error:'Unauthorized, token not found'});
        }
        if (error instanceof Forbidden) {
            return res.status(403).json({error:'Forbidden'});
        }
        return res.status(500).json({error: 'Internal server error'});
    }
});

ModerationRouter.get('/reports/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Get a report by id'
        #swagger.parameters['id'] = {
            description: 'Report id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Report found',
            schema: { $ref: "#/definitions/ReportOutputDefinition" }
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR1' && role !== 'MODERATOR2') {
            throw new Forbidden();
        }
        console.log('Param',req.params.id);
        const report = await ModerationService.getReport(req.params.id);
        res.status(200).send(report);
    } catch (error:any) {
        if(error instanceof JwtNotInHeaderException) {
            return res.status(401).json({error:'Unauthorized, token not found'});
        }
        if(error instanceof Forbidden) {
            return res.status(403).json({error:'Forbidden'});
        }
        return res.status(500).json({error: 'Internal server error'});
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
        if(role !== 'ADMIN' && role !== 'MODERATOR1' && role !== 'MODERATOR2') {
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
        if(role !== 'ADMIN' && role !== 'MODERATOR1' && role !== 'MODERATOR2') {
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
        if(role !== 'ADMIN' && role !== 'MODERATOR1' && role !== 'MODERATOR2') {
            throw new Error('You are not allowed to see this');
        }
        await ModerationService.banUser(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

export default ModerationRouter;