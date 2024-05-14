import Stripe from 'stripe';

class StripeService {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    static async createCheckoutSession(userId: string){
        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment', 
            payment_method_types: ['card']
        })

        return session;
    }
}

export default StripeService;