import { UserOutputDto, UserPublicOutputDto } from '@/types/dtos/UserDto'
import { User } from '@prisma/client'

export const toUserOutput = (user: User): UserOutputDto => {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        telephone: user.telephone,
        address: user.address,
        profession: user.profession,
        description: user.description,
        politicSide: user.politicSide,
        follows: user.follows,
        language: user.language,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

export const toPublicUserOutput = (user: User): UserPublicOutputDto => {
    return {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        politicSide: user.politicSide,
        language: user.language,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}