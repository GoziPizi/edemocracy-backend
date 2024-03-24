import UserRepository from "@/repositories/UserRepository";
import UserService from "./UserService";
import { JwtPayload } from "@/types/JwtPayload";
import Jwt from "@/classes/Jwt";
import { JwtCheckException } from "@/exceptions/JwtExceptions";
import { Role } from "@prisma/client";

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
        const payload: JwtPayload = {id: user.id, lastConnexion: currentDate}
        return new Jwt(payload, this.timeExpiration).jwt
    }

    static async register(userInput: any) {
        let finalUser = {
            ...userInput,
            role: Role.USER
        }
        const user = await this.userRepository.create(finalUser)
        const currentDate = new Date()
        UserService.updateUserLastLogin(user.id, currentDate)
        const payload: JwtPayload = {id: user.id, lastConnexion: currentDate}
        return new Jwt(payload, this.timeExpiration).jwt
    }

    static async checkToken(token: string): Promise<boolean> {
        try {
            Jwt.checkToken(token)
            return true
        } catch (error) {
            throw JwtCheckException
        }
    }

    static getUserId(token: string): string {
        return Jwt.decode(token).payload.id
    }

    static async getUserRole(token: string): Promise<Role> {
        const userId = this.getUserId(token)
        const user = await UserService.getUserById(userId)
        return user.role
    }

    static async getAdmins() {
        return this.userRepository.getAdmins()
    }

    static async setRoleToUserByEmail(email: string, role: Role) {
        await this.userRepository.setRoleByEmail(email, role)
        return
    }

    static async setRoleToUser(userId: string, role: Role) {
        await this.userRepository.setRole(userId, role)
        return
    }
}

export default AuthentificationService;