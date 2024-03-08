import UserRepository from "@/repositories/UserRepository";


class UserService {

    private static userRepository: UserRepository = new UserRepository()

    static async createUser(user: any) {
        const createdUser = await UserService.userRepository.create(user);
    }
}

export default UserService;