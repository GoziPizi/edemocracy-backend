import UserRepository from "@/repositories/UserRepository";
import UserService from "./UserService";
import { JwtPayload } from "@/types/JwtPayload";
import Jwt from "@/classes/Jwt";

class AuthentificationService {
    private static userRepository: UserRepository = new UserRepository()

    private static timeExpiration = 60 * 60 * 24 * 7 // 7 days

    static async login(email: string, password: string) {
        const user = await this.userRepository.checkUser(email,password)
        if(!user) {
            throw new Error('User not found')
        }
        const currentDate = new Date()
        UserService.updateUserLastLogin(user.id, currentDate)
        const payload: JwtPayload = {id: Number(user.id), lastConnexion: currentDate}
        return new Jwt(payload, this.timeExpiration).jwt
    }
}

export default AuthentificationService;