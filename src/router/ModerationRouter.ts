import { Forbidden } from '@/exceptions/AdminExceptions';
import { MissingArgumentException } from '@/exceptions/BaseExceptions';
import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import { ReportIntToReportType } from '@/mappers/ReportType';
import AuthentificationService from '@/services/AuthentificationService';
import ModerationService from '@/services/ModerationService';
import { personalReport } from '@/types/dtos/ModerationDtos';
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
        console.log(error);
        if (error instanceof JwtNotInHeaderException) {
            return res.status(401).json({error:'Unauthorized, token not found'});
        }
        return res.status(500).json({error: 'Internal server error'});
    }
});

//Poster une sanction
ModerationRouter.post('/sanction', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Post a sanction'
        #swagger.parameters['userId'] = {
            description: 'User id',
            required: true
        }
        #swagger.parameters['sanctionType'] = {
            description: 'Sanction type',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Sanction posted',
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

        const reportId: string = req.body.reportId;
        const sanctionType: string = req.body.sanctionType;
        const sanctionDuration: number = req.body.sanctionDuration;

        const moderatorId = AuthentificationService.getUserId(token);

        const newSanction = await ModerationService.postSanction(reportId, moderatorId, sanctionType, sanctionDuration);
        res.status(200).send(newSanction);
    } catch (error:any) {
        console.log(error);
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
        #swagger.description = 'Get the list of reports, ordered by most recent'
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
        const reports = await ModerationService.getReportsForModerationLvl1();
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

ModerationRouter.get('/reports/:id/escalate-to-moderation-2', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Escalate the report to a mod2'
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
        const id = req.params.id;
        await ModerationService.escalateToModeration2(id);
        res.status(200).send();
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

ModerationRouter.get('/moderation-2-reports', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Get the list of reports only for mod2, ordered by most recent'
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
        if(role !== 'MODERATOR2' && role !== 'ADMIN') {
            throw new Forbidden();
        }
        const reports = await ModerationService.getModeration2Reports();
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

ModerationRouter.get('/reports/:id/entity', async (req: Request, res: Response, next: NextFunction) => {
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
        const report = await ModerationService.getEntityOfReport(req.params.id);
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
        next(error);
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
        //TODO : update this, it is obsolete
        await ModerationService.deleteEntity(req.params.id);
        res.status(200).send();
    } catch (error) {
        next(error);
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

//Moderation as a user 

ModerationRouter.get('/personal-reports', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Get the list of reports that concerns you'
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
        const userId = AuthentificationService.getUserId(token);
        const reports: personalReport[] = await ModerationService.getPersonalReports(userId);
        res.status(200).send(reports);
    } catch (error:any) {
        if (error instanceof JwtNotInHeaderException) {
            return res.status(401).json({error:'Unauthorized, token not found'});
        }
        return res.status(500).json({error: 'Internal server error'});
    }
});

//Contest a report
ModerationRouter.post('/reports/:id/contest', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Moderation']
        #swagger.description = 'Contest a report'
        #swagger.parameters['id'] = {
            description: 'Report id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Report contested',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);

        const reason = req.body.reason;
        const reportId = req.params.id;

        const contestEvent = await ModerationService.contestReport(reportId, userId, reason);
        res.status(200).send(contestEvent);
    } catch (error:any) {
        console.log(error);
        if (error instanceof JwtNotInHeaderException) {
            return res.status(401).json({error:'Unauthorized, token not found'});
        }
        if(error instanceof Forbidden) {
            return res.status(403).json({error:'Forbidden'});
        }
        return res.status(500).json({error: 'Internal server error'});
    }
});

export default ModerationRouter;