import UserRepository from "@/repositories/UserRepository"
import StripeService from "./StripeService";

class ContributionService {

    private static userRepository: UserRepository = new UserRepository()

    static async getCheckoutSession(userId: string) {
        const user = await this.userRepository.findById(userId);
        if(!user) {
            throw new Error('User not found');
        }
        if(user.contribution) {
            throw new Error('User already contributed');
        }
        const session = await StripeService.createCheckoutSession(userId, user.email);
        return session;
    }

    static async handleStripeEvent(stripeEvent: any) {
        
        switch(stripeEvent.type) {
            case 'checkout.session.completed':
                ContributionService.handleSucceededSession(stripeEvent.data.object);
                break;
            default:
                throw new Error('Unhandled event');
        }
    }

    static async handleSucceededSession(stripeEvent: any) {
        const email = stripeEvent.customer_email;
        await this.userRepository.updateContribution(email);
    }

}

export default ContributionService