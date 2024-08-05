import { toPublicUserOutput, toUserOutput } from "@/mappers/UserMapper";
import OpinionRepository from "@/repositories/OpinionRepository";
import PartyRepository from "@/repositories/PartyRepository";
import PersonalityRepository from "@/repositories/PersonalityRepository";
import UserRepository from "@/repositories/UserRepository";
import { UserOutputDto, UserPublicOutputDto } from "@/types/dtos/UserDto";
import AwsService from "./AwsService";
import { ResizeService } from "./ResizeService";


class UserService {

    private static userRepository: UserRepository = new UserRepository()
    private static personalityRepository: PersonalityRepository = new PersonalityRepository()
    private static partyRepository: PartyRepository = new PartyRepository()
    private static opinionRepository: OpinionRepository = new OpinionRepository()

    static async createUser(user: any) {
        const finalUser = {
            ...user,
            verified: false,
            contribution: false
        }
        const createdUser = await UserService.userRepository.create(user);
        return createdUser;
    }

    static async deleteUserById(userId: string) {
        return UserService.userRepository.delete(userId);
    }

    static async updateUserPassword(id: string, password: string) {
        return await UserService.userRepository.updatePassword(id, password);
    }

    static async updateProfilePicture(id: string, profilePicture: Express.Multer.File) {
        await ResizeService.checkRatio(profilePicture, 1);
        profilePicture = await ResizeService.resizeProfilePicture(profilePicture);
        const imageUrl = await AwsService.uploadProfilePicture(profilePicture, id);
        return await UserService.userRepository.updateProfilePicture(id, imageUrl);
    }

    static async deleteUser(id: string) {
        return await UserService.userRepository.delete(id);
    }

    static async getUserById(id: string): Promise<UserOutputDto> {
        const user = await UserService.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return toUserOutput(user);
    }

    static async getUserByEmail(email: string) {
        return await UserService.userRepository.getUserByEmail(email);
    }

    static async updateUserById(id: string, user: any) {
        return UserService.userRepository.update(id, user);
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

    static async getUserPartisById(id: string) {
        return await UserService.partyRepository.findPartisByUserId(id);
    }

    static async getUserOpinions(id: string) {
        return await UserService.opinionRepository.findOpinionsWithTitleByUserId(id);
    }

    static async follow(id: string, entityId: string, entityType: string) {
        const actualFollow = await UserService.userRepository.findSingleFollowByUserId(id, entityId);
        if (actualFollow) {
            return await UserService.userRepository.deleteFollow(id, entityId);
        }
        return await UserService.userRepository.follow(id, entityType, entityId);
    }

    static async getUserFollows(id: string) {
        return await UserService.userRepository.findFollowsByUserId(id);
    }

    static async isUserFollowing(id: string, entityId: string) {
        const follow = await UserService.userRepository.findSingleFollowByUserId(id, entityId);
        if (follow) {
            return true;
        }
        return false;
    }

    static async postOpinion(userId: string, topicId: string, opinion: string) {
        return await UserService.opinionRepository.createOpinion(userId, topicId, opinion);
    }

    static async deleteOpinion(userId: string, id: string) {
        const opinion = await UserService.opinionRepository.findById(id);
        if (!opinion) {
            throw new Error('Opinion not found');
        }
        if (opinion.userId !== userId) {
            throw new Error('Unauthorized');
        }
        return await UserService.opinionRepository.delete(id);
    }

    static async setUserVerified(email: string) {
        return await UserService.userRepository.setUserVerified(email);
    }
}

export default UserService;