import UserRepository from "@/repositories/UserRepository"
import StripeService from "./StripeService";
import { MembershipStatus } from "@prisma/client";

class ContributionService {

    private static userRepository: UserRepository = new UserRepository()

    static async createStandardCheckoutSession(userId: string) {
        const user = await this.userRepository.findById(userId);
        if(!user) {
            throw new Error('User not found');
        }
        if(user.contributionStatus === MembershipStatus.PREMIUM || user.contributionStatus === MembershipStatus.STANDARD) {
            throw new Error('User already contributed');
        }
        const session = await StripeService.createCheckoutSessionForStandard(user.email);
        return session;
    }

    static async createPremiumCheckoutSession(userId: string) {
        const user = await this.userRepository.findById(userId);
        if(!user) {
            throw new Error('User not found');
        }
        if(user.contributionStatus === MembershipStatus.PREMIUM) {
            throw new Error('User already contributed to premium');
        }
        const session = await StripeService.createCheckoutSessionForPremium(user.email);
        return session;
    }
}

export default ContributionService