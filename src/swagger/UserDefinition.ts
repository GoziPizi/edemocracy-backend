import {
  FreeUserCreateInputDto,
  UserOutputDto,
  UserPublicOutputDto,
  UserUpdateInputDto,
} from '@/types/dtos/UserDto';
import { Affiliation, MembershipStatus } from '@prisma/client';

export const UserCreateInputDefinition: FreeUserCreateInputDto = {
  email: 'string',
  password: 'string',
  name: 'string',
  address: 'string',
  postalCode: 'string',
  city: 'string',
  profession: 'string',
  telephone: 'string',
  firstName: 'string',
  language: 'string',
  politicSide: Affiliation.RIGHT,
};

export const UserOutputDefinition: UserOutputDto = {
  id: '1',
  email: 'string',
  name: 'string',
  address: 'string',
  postalCode: 'string',
  city: 'string',
  profession: 'string',
  yearsOfExperience: 1,
  idNationality1: 'string',
  idNationality2: 'string',
  idNationality3: 'string',
  description: 'string',
  telephone: 'string',
  firstName: 'string',
  profilePicture: 'string',
  religion: 'string',
  origin1: 'string',
  origin2: 'string',
  origin3: 'string',
  origin4: 'string',
  birthSex: 'string',
  actualSex: 'string',
  sexualOrientation: 'string',
  contributionStatus: MembershipStatus.NONE,
  language: 'string',
  politicSide: Affiliation.RIGHT,
  role: 'USER',
  reputation: 1,
  sponsorshipCode: 'string',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const UserPublicOutputDefinition: UserPublicOutputDto = {
  id: '1',
  name: 'string',
  firstName: 'string',
  language: 'string',
  profilePicture: 'string',
  contributionStatus: MembershipStatus.NONE,
  politicSide: Affiliation.RIGHT,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const UserUpdateInputDefinition: UserUpdateInputDto = {
  email: 'string',
  name: 'string',
  address: 'string',
  profession: 'string',
  telephone: 'string',
  firstName: 'string',
  language: 'string',
  politicSide: Affiliation.RIGHT,
};
