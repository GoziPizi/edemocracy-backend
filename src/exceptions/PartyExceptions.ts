import HttpStatus from '@/enum/HttpStatus'

import BaseException from './BaseExceptions'

export class PartyNotFoundException extends BaseException {
  constructor(message = 'Party not found') {
    super(message, HttpStatus.NOT_FOUND)
  }
}

export class UserNotInPartyException extends BaseException {
  constructor(message = 'User not in party') {
    super(message, HttpStatus.FORBIDDEN)
  }
}