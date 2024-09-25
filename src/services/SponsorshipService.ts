import SponsorshipRepository from "@/repositories/SponsorshipRepository";
import UserRepository from "@/repositories/UserRepository";
import { PersonalJackpotOutputDto } from "@/types/dtos/JackpotDtos";

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
            console.log(error);
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

        const jackpot = await this.sponsorshipRepository.setSponsorshipStatusToPending(userId);

        const formattedJackpot = {
            amount: jackpot.amount,
            iban: jackpot.iban,
            status: jackpot.status
        }

        return formattedJackpot;
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

}

export default SponsorshipService;