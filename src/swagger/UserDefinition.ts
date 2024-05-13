import { UserCreateInputDto, UserOutputDto, UserPublicOutputDto, UserUpdateInputDto } from '@/types/dtos/UserDto'
import { Affiliation } from '@prisma/client'

export const UserCreateInputDefinition: UserCreateInputDto = {
    email: 'string',
    password: 'string',
    name: 'string',
    address: 'string',
    profession: 'string',
    telephone: 'string',
    firstName: 'string',
    language: 'string',
    politicSide: Affiliation.RIGHT
}

export const UserOutputDefinition: UserOutputDto = {
    id: '1',
    email: 'string',
    name: 'string',
    address: 'string',
    profession: 'string',
    description: 'string',
    telephone: 'string',
    firstName: 'string',
    profilePicture: 'string',
    contribution: false,
    language: 'string',
    politicSide: Affiliation.RIGHT,
    follows: ['1'],
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date()
}

export const UserPublicOutputDefinition: UserPublicOutputDto = {
    id: '1',
    name: 'string',
    firstName: 'string',
    language: 'string',
    contribution: false,
    profilePicture: 'string',
    politicSide: Affiliation.RIGHT,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const UserUpdateInputDefinition: UserUpdateInputDto = {
    email: 'string',
    name: 'string',
    address: 'string',
    profession: 'string',
    telephone: 'string',
    firstName: 'string',
    language: 'string',
    politicSide: Affiliation.RIGHT
}