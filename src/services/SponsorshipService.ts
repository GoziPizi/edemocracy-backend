import { JackpotAlreadyRequestedException, JackpotAmountIsZeroException, JackpotIbanNullException, JackpotNotFoundException } from "@/exceptions/SponsorshipExceptions";
import SponsorshipRepository from "@/repositories/SponsorshipRepository";
import UserRepository from "@/repositories/UserRepository";
import { AdminViewPersonalJackpot, PersonalJackpotOutputDto } from "@/types/dtos/JackpotDtos";
import { jackpotStatus } from "@prisma/client";

class SponsorshipService {
  
    private static userRepository: UserRepository = new UserRepository();
    private static sponsorshipRepository: SponsorshipRepository = new SponsorshipRepository();

    static async getSponsorshipCode(userId: string): Promise<string> {
        //Get the user from the database
        //return the code

        try {
            const user = await this.userRepository.findById(userId);
            if(!user) {
                throw new Error('User not found');
            }
            if(!user.sponsorshipCode) {
                throw new Error('User does not have a code');
            }
            return user.sponsorshipCode;
        } catch (error) {
            throw new Error('Could not get the code');
        }
    }

    static async generateSponsorshipCode(userId: string): Promise<string> {
        //Genrates a random 10 characters string
        //add it to the user in the database

        //return a promise of the generated code

        const code = Math.random().toString(36).substring(2, 12);

        try {
            await this.userRepository.setSponsorshipCodeToUser(userId, code);
            return code;
        } catch (error) {
            throw new Error('Could not generate the code');
        }
    }

    static async getPersonalJackpot(userId: string): Promise<PersonalJackpotOutputDto> {

        //get the jackpot from the db
        //return the formatted jackpot

        const jackpot = await this.sponsorshipRepository.getPersonalJackpot(userId);

        if(!jackpot) {
            throw new Error('Jackpot not found');
        }

        const formattedJackpot = {
            amount: jackpot.amount,
            iban: jackpot.iban,
            status: jackpot.status
        }

        return formattedJackpot;

    }

    static async setPersonalJackpotIBAN(userId: string, iban: string): Promise<PersonalJackpotOutputDto> {
        //set the iban to the jackpot in the db
        //return the formatted jackpot

        const jackpot = await this.sponsorshipRepository.setPersonalJackpotIBAN(userId, iban);

        const formattedJackpot = {
            amount: jackpot.amount,
            iban: jackpot.iban,
            status: jackpot.status
        }

        return formattedJackpot;
    }

    static async withdrawPersonalJackpot(userId: string): Promise<PersonalJackpotOutputDto> {
        //withdraw the jackpot from the db
        //return the formatted jackpot

        //Throw a error if amount is 0 or iban is null or jackpot already requested or jackpot not found

        try {

            let jackpot = await this.sponsorshipRepository.getPersonalJackpot(userId);

            if (!jackpot) throw new JackpotNotFoundException();
            if (jackpot.amount === 0) throw new JackpotAmountIsZeroException();
            if (!jackpot.iban) throw new JackpotIbanNullException();
            if (jackpot.status === jackpotStatus.REQUESTED) throw new JackpotAlreadyRequestedException();

            jackpot = await this.sponsorshipRepository.setSponsorshipStatusToRequested(userId);

            const formattedJackpot = {
                amount: jackpot.amount,
                iban: jackpot.iban,
                status: jackpot.status
            }

            return formattedJackpot;

        } catch (error:any) {
            if (
                error instanceof JackpotNotFoundException ||
                error instanceof JackpotAmountIsZeroException ||
                error instanceof JackpotIbanNullException ||
                error instanceof JackpotAlreadyRequestedException
            ) {
                throw error;
            }
            throw new Error('Could not withdraw the jackpot');
        }

    }

    static async checkSponsorshipCode(code: string): Promise<boolean> {
        //get the user from the db
        //check if the code is the same
        //return the result

        const user = await this.userRepository.getUserBySponsorshipCode(code);

        if(!user) {
            throw new Error('User not found');
        }

        return true;

    }

    static async adminGetNonEmptyJackpots(): Promise<AdminViewPersonalJackpot[]> {

        //get all the jackpots from the db
        //return the formatted jackpots

        const jackpots = await this.sponsorshipRepository.getNonEmptyJackpots();

        const formattedJackpots = jackpots.map(jackpot => {
            return {
                amount: jackpot.amount,
                iban: jackpot.iban,
                status: jackpot.status,
                userId: jackpot.userId
            }
        });

        return formattedJackpots;
        
    }

    static async adminConfirmJackpotPayment(userId: string): Promise<void> {
        //set the status of the jackpot to paid
        //set the amount to 0, the iban to null and the status to pending

        await this.sponsorshipRepository.resetUserJackpot(userId);

    }

}

export default SponsorshipService;