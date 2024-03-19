import { toPublicUserOutput, toUserOutput } from "@/mappers/UserMapper";
import PartyRepository from "@/repositories/PartyRepository";
import PersonalityRepository from "@/repositories/PersonalityRepository";
import UserRepository from "@/repositories/UserRepository";
import { UserOutputDto, UserPublicOutputDto } from "@/types/dtos/UserDto";


class UserService {

    private static userRepository: UserRepository = new UserRepository()
    private static personalityRepository: PersonalityRepository = new PersonalityRepository()
    private static partyRepository: PartyRepository = new PartyRepository()

    static async createUser(user: any) {
        const createdUser = await UserService.userRepository.create(user);
    }

    static async getUserById(id: string): Promise<UserOutputDto> {
        const user = await UserService.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return toUserOutput(user);
    }

    static async getPublicUserById(id: string): Promise<UserPublicOutputDto> {
        const user = await UserService.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return toPublicUserOutput(user);
    }

    static async updateUserLastLogin(id: string, date: Date) {
        await UserService.userRepository.updateLastLogin(id, date);
        return true;
    }

    static async getUserPersonalityById(id: string) {
        return await UserService.personalityRepository.findPersonalityByUserId(id);
    }

    static async getUserPartyById(id: string) {
        return await UserService.partyRepository.findPartyByUserId(id);
    }
}

export default UserService;