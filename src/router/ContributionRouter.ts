import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import ContributionService from '@/services/ContributionService';
import StripeService from '@/services/StripeService';
import express, { NextFunction, Request, Response } from 'express';

const ContributionRouter = express.Router();

ContributionRouter.get('/standard', async (req: Request, res: Response, next: NextFunction) => {
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
        const session = await ContributionService.createStandardCheckoutSession(userId);
        res.status(200).json({url: session.url});
    } catch (error) {
        next(error);
    }
});

ContributionRouter.get('/premium', async (req: Request, res: Response, next: NextFunction) => {
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
        const session = await ContributionService.createPremiumCheckoutSession(userId);
        res.status(200).json({url: session.url});
    } catch (error) {
        next(error);
    }
});

export default ContributionRouter;