import express, { NextFunction, Request, Response } from 'express';
import StripeService from '@/services/StripeService';
import Stripe from 'stripe';

const StripeRouter = express.Router();

StripeRouter.post(
    '/webhook',
    express.raw({type: 'application/json'}),
    async (req: Request, res: Response, next: NextFunction) => {
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

        const sig = req.headers['stripe-signature'];

        if(!sig) {
            throw new Error('Stripe signature missing');
        }
        
        let event: Stripe.Event

        try {
            event = StripeService.constructStripeEvent(JSON.parse(req.body), sig);
            console.log('event', event);
        } catch (error: any) {
            res.status(400).send(`Webhook Error: ${error.message}`);
            return;
        }
        const stripeEvent = req.body;
        console.log('stripeEvent', stripeEvent);
        await StripeService.handleStripeEvent(stripeEvent);
        res.json({received: true});
    } catch (error) {
        next(error);
    }
});

export default StripeRouter;