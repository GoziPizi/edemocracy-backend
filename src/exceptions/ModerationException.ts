import HttpStatus from '@/enum/HttpStatus'

import BaseException from './BaseExceptions'

export class EntityAlreadyReportedByUserException extends BaseException {
  constructor(message = 'Entity already reported by user') {
    super(message, HttpStatus.CONFLICT)
  }
}

export class ContentWithBanWordsException extends BaseException {
  constructor(message = 'Content contains banned words') {
    super(message, HttpStatus.CONFLICT)
  }
}

export class UserBannedException extends BaseException {
  constructor(message = 'User is banned') {
    super(message, HttpStatus.FORBIDDEN)
  }
}