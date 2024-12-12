import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import NotificationService from '@/services/NotificationService';
import express, { NextFunction, Request, Response } from 'express';

const NotificationRouter = express.Router();

NotificationRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Notification']
        #swagger.description = 'Endpoint to get all notifications, only accessible by the user who received the notifications.'
        #swagger.responses[200] = {
            description: 'List of notifications found',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const notifications = await NotificationService.getNotifications(userId);
        res.status(200).send(notifications);
    } catch (error) {
        next(error);
    }
});

NotificationRouter.post('/r ead', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Notification']
        #swagger.description = 'Endpoint to mark a notification as read, only accessible by the user who received the notification.'
        #swagger.parameters['id'] = { description: 'Notification id', required: true }
        #swagger.responses[200] = {
            description: 'Notification marked as read',
        }
        #swagger.responses[404] = {
            description: 'Notification not found',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        await NotificationService.markAsRead(req.body.id, userId);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

NotificationRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Notification']
        #swagger.description = 'Endpoint to delete a notification, only accessible by the user who received the notification.'
        #swagger.parameters['id'] = { description: 'Notification id', required: true }
        #swagger.responses[200] = {
            description: 'Notification deleted',
        }
        #swagger.responses[404] = {
            description: 'Notification not found',
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        await NotificationService.deleteNotification(req.params.id, userId);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

export default NotificationRouter;
