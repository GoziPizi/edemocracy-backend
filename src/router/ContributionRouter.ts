import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import ContributionService from '@/services/ContributionService';
import express, { NextFunction, Request, Response } from 'express';

const ContributionRouter = express.Router();

ContributionRouter.get('/checkout-session', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Contribution']
        #swagger.summary = 'Endpoint to create a checkout session.'
        #swagger.responses[200] = {
            description: 'Checkout session created',
            schema: { $ref: "#/definitions/CheckoutSessionDefinition" }
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        await AuthentificationService.checkToken(token);
        const userId = AuthentificationService.getUserId(token);
        const session = await ContributionService.getCheckoutSession(userId);
        res.status(200).send(session);
    } catch (error) {
        next(error);
    }
});

ContributionRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Contribution']
        #swagger.summary = 'Endpoint to handle stripe webhook.'
        #swagger.responses[200] = {
            description: 'Webhook handled'
        }
        #swagger.responses[500] = {
            description: 'An error occured'
        }
     */
    try {
        const stripeEvent = req.body;
        await ContributionService.handleStripeEvent(stripeEvent);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});