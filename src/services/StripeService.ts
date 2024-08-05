import PreRegistrationRepository from '@/repositories/PreRegistrationRepository';
import UserRepository from '@/repositories/UserRepository';
import AuthentificationService from './AuthentificationService';
import Stripe from 'stripe';
import { MembershipStatus } from '@prisma/client';

class StripeService {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    private static standard_product_id: string = process.env.STANDARD_PRODUCT_ID!;
    private static premium_product_id: string = process.env.PREMIUM_PRODUCT_ID!;
    private static userRepository: UserRepository = new UserRepository();
    private static preRegistrationRepository: PreRegistrationRepository = new PreRegistrationRepository();

    static async createCheckoutSessionForStandard(email: string) {
        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product: process.env.STANDARD_PRODUCT_ID,
                        unit_amount: 499,
                    },
                    quantity: 1,
                },
            ],
            success_url: process.env.SUCCESS_STANDARD_URL
        })
        return session;
    }

    static async createCheckoutSessionForPremium(email: string) {
        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product: process.env.PREMIUM_PRODUCT_ID,
                        unit_amount: 1499,
                    },
                    quantity: 1,
                },
            ],
            success_url: process.env.SUCCESS_PREMIUM_URL
        })
        return session;
    }

    static constructStripeEvent(payload: Buffer, sig: string | string[]) {
        return this.stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SECRET!);
    }

    static async handleStripeEvent(stripeEvent: any) {
        
        switch(stripeEvent.type) {
            case 'checkout.session.completed':
                StripeService.handleCompletedSession(stripeEvent.data.object);
                break;

            case 'checkout.session.expired':
                StripeService.handleExpiredSession(stripeEvent.data.object);
            default:
                throw new Error('Unhandled event');
        }
    }

    static async handleCompletedSession(stripeEvent: any) {

        const email = stripeEvent.customer_email;
        const preRegistration = await this.preRegistrationRepository.getPreRegistration(email);
        const paiementStatus = stripeEvent.payment_status;

        const checkoutSession = await this.stripe.checkout.sessions.retrieve(stripeEvent.id);
        console.log('CHECKOUT SESSION', checkoutSession);
        
        if(!checkoutSession) {
            throw new Error('Checkout session not found');
        }

        const productId = checkoutSession.line_items?.data[0].price?.product as string;

        if(productId !== this.standard_product_id && productId !== this.premium_product_id) {
            throw new Error('Invalid product id');
        }

        const premium = productId === this.premium_product_id;

        if(paiementStatus !== 'paid') {
            await this.preRegistrationRepository.deletePreRegistration(email);
            return;
        }
        if(preRegistration) {
            console.log('PRE REGISTRATION FOUND');
            await AuthentificationService.registerFromPreRegistration(email, premium);
            console.log('USER REGISTERED');
            return;
        }
        const user = await this.userRepository.getUserByEmail(email);
        if(user) {
            console.log('USER FOUND');
            const contributionStatus = premium ? MembershipStatus.PREMIUM : MembershipStatus.STANDARD;
            await this.userRepository.updateContributionStatus(user.id, contributionStatus);
            console.log('USER UPDATED');
            return;
        }
    }

    static async handleExpiredSession(stripeEvent: any) {
        const email = stripeEvent.customer_email;
        const preRegistration = await this.preRegistrationRepository.getPreRegistration(email);
        if(preRegistration) {
            await this.preRegistrationRepository.deletePreRegistration(email);
        }
        const verification = await this.userRepository.getVerificationRequest(email);
        if(verification) {
            await this.userRepository.deleteVerificationRequest(verification.id);
        }
    }
}

export default StripeService;