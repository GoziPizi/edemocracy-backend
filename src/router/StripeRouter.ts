import express, { NextFunction, Request, Response } from 'express';
import StripeService from '@/services/StripeService';
import ContributionService from '@/services/ContributionService';

const StripeRouter = express.Router();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

StripeRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
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
        const sig = req.headers['stripe-signature'] as string;
        if(!sig) {
            throw new Error('Stripe signature missing');
        }
        let event;
        try {
            event = StripeService.verifyStripeEvent(req.body, sig, endpointSecret || '');
        } catch (error: any) {
            res.status(400).send(`Webhook Error: ${error.message}`);
        }
        const stripeEvent = req.body;
        await StripeService.handleStripeEvent(stripeEvent);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

export default StripeRouter;