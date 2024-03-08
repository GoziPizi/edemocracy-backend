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
    affiliation: Affiliation.DROITE    
}

export const UserOutputDefinition: UserOutputDto = {
    id: '1',
    email: 'string',
    name: 'string',
    address: 'string',
    profession: 'string',
    telephone: 'string',
    firstName: 'string',
    language: 'string',
    affiliation: Affiliation.DROITE,
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
    affiliation: Affiliation.DROITE
}