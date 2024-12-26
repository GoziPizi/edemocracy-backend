import { Forbidden } from '@/exceptions/AdminExceptions';
import { MissingArgumentException } from '@/exceptions/BaseExceptions';
import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import { ReportIntToReportType } from '@/mappers/ReportType';
import AuthentificationService from '@/services/AuthentificationService';
import ModerationService from '@/services/ModerationService';
import { personalReport } from '@/types/dtos/ModerationDtos';
import { ReportingEventInputDto } from '@/types/ModerationTypes';
import { ReportingType } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express'
import Joi from 'joi';

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
        //TODO handle case where entity has already been moderated
        //TODO handle case it has already been reported by this user
        const report = await ModerationService.report(userId, entityId, entityType as ReportingType, reason);
        res.status(200).send(report);
    } catch (error:any) {
        next(error);
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

        const schema = Joi.object({
            reportingId: Joi.string().required(),
            sanctionType: Joi.string().required(),
            sanctionDuration: Joi.number().optional(),
            reason: Joi.string().optional(),
            targetedUserId: Joi.string().optional()
        })

        const { error } = schema.validate(req.body);

        const reportingId = req.body.reportingId;

        const reportingEvent: ReportingEventInputDto = {
            type: req.body.sanctionType,
            duration: req.body.sanctionDuration,
            reason: req.body.reason,
            reportingId: reportingId,
            targetedUserId: req.body.targetedUserId
        }

        const moderatorId = AuthentificationService.getUserId(token);

        console.log(reportingEvent);

        const newSanction = await ModerationService.postSanction(moderatorId, reportingId, reportingEvent);
        res.status(200).send(newSanction);
    } catch (error:any) {
        next(error);
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
        next(error);
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
        next(error);
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
        next(error);
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
        next(error);
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
        next(error);
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
        next(error);
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
        next(error);
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
        next(error);
    }
});

//Warn user
ModerationRouter.post('/user/:id/warn', async (req: Request, res: Response, next: NextFunction) => {
    //TOTEST warn a user 
    //Possible to add a report id to link the warn to a report
    //Reason is mandatory
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }

        const roleId = await AuthentificationService.getUserRole(token);
        if(roleId !== 'ADMIN' && roleId !== 'MODERATOR1' && roleId !== 'MODERATOR2') {
            throw new Forbidden();
        }
        const moderatorId = AuthentificationService.getUserId(token);

        const userId = req.params.id;
        const reason = req.body.reason;
        const reportId = req.body.reportId;

        if(!reason) {
            throw new MissingArgumentException('reason');
        }

        const warn = await ModerationService.warnUser(userId, moderatorId, reason, reportId);
        res.status(200).send(warn);

    } catch (error:any) {
        next(error);
    }
})

//Historic

ModerationRouter.get('/moderators', async (req: Request, res: Response, next: NextFunction) => {
    //TOTEST Liste des modérateurs
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR2') {
            throw new Forbidden();
        }
        const moderators = await ModerationService.getModerators();
        res.status(200).send(moderators);
    } catch (error:any) {
        next(error);
    }
});

ModerationRouter.get('/historic', async (req: Request, res: Response, next: NextFunction) => {
    //TOTEST Historique de tous les évènements de modération.
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR2') {
            throw new Forbidden();
        }
        const events = await ModerationService.getHistoric();
        res.status(200).send(events);
    } catch (error:any) {
        next(error);
    }
});

ModerationRouter.get('/historic/:moderatorId', async (req: Request, res: Response, next: NextFunction) => {
    //TOTEST Historique de tous les évènements de modération pour un modérateur.
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const role = await AuthentificationService.getUserRole(token);
        if(role !== 'ADMIN' && role !== 'MODERATOR2') {
            throw new Forbidden();
        }
        const events = await ModerationService.getHistoricOfModerator(req.params.moderatorId);
        res.status(200).send(events);
    } catch (error:any) {
        next(error);
    }
});

export default ModerationRouter;