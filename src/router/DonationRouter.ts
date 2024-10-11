import StripeService from '@/services/StripeService';
import express, { NextFunction, Request, Response } from 'express';

const DonationRouter = express.Router();

DonationRouter.post('/get-checkout-session', async (req: Request, res: Response, next: NextFunction) => {
    /**
        Endpoint to create a checkout session.
        #swagger.tags = ['Donation']
        Needs the amount in the body
        Needs an email in the body
     */
    try {
        const email = req.body.email;
        const amount = req.body.amount;

        //Input validation

        if(!email) {
            throw new Error('Email is required');
        }

        if(!amount) {
            throw new Error('Amount is required');
        }

        if(isNaN(amount)) {
            throw new Error('Amount must be a number');
        }

        if(amount < 1) {
            throw new Error('Amount must be greater than 0');
        }

        //check integer

        if(!Number.isInteger(amount)) {
            throw new Error('Amount must be an integer');
        }

        const session = await StripeService.createCheckoutSessionDonation(email, amount);
        res.status(200).json({url: session.url});
    } catch (error) {
        next(error);
    }
});