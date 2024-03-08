import { toPublicUserOutput, toUserOutput } from "@/mappers/UserMapper";
import UserRepository from "@/repositories/UserRepository";
import { UserOutputDto, UserPublicOutputDto } from "@/types/dtos/UserDto";


class UserService {

    private static userRepository: UserRepository = new UserRepository()

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
}

export default UserService;