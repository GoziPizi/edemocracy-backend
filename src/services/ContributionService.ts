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
        const session = await StripeService.createCheckoutSession(userId);
        return session;
    }

    static async handleStripeEvent(stripeEvent: any) {
        // Handle stripe event
    }

}

export default ContributionService