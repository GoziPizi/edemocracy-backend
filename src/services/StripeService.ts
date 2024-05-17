import Stripe from 'stripe';

class StripeService {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    private static contribution_product_id: string = process.env.CONTRIBUTION_PRODUCT_ID!;
    private static success_url: string = process.env.STRIPE_SUCCESS_URL!;

    static async createCheckoutSession(userId: string, email: string){
        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment', 
            payment_method_types: ['card'],
            customer_email: email,
            metadata: {
                userId,
            },
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product: this.contribution_product_id,
                        unit_amount: 500,
                    },
                    quantity: 1,
                },
            ],
            success_url: this.success_url,

        })

        return session;
    }

    //throw an error if the signature is not valid
    static verifyStripeEvent(payload: any, sig: string, endpointSecret: string) {
        return this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    }
}

export default StripeService;