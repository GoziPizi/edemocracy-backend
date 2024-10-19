import StripeService from '@/services/StripeService';
import express, { NextFunction, Request, Response } from 'express';

const DonationRouter = express.Router();

DonationRouter.post('/get-checkout-session', async (req: Request, res: Response, next: NextFunction) => {
    /**
        Endpoint to create a checkout session.
        #swagger.tags = ['Donation']
        Needs the amount in the body
        and the interval
     */
    try {
        const email:string | null = req.body.email;
        const amount = req.body.amount;
        const interval : string | null = req.body.isRecurring;

        //Input validation

        if(interval) {
            if(interval !== 'month' && interval !== 'year') {
                throw new Error('Interval must be month or year');
            }
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

        const session = await StripeService.createCheckoutSessionDonation(email, amount, interval);
        res.status(200).json({url: session.url});
    } catch (error) {
        next(error);
    }
});

export default DonationRouter;