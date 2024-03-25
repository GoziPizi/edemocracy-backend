import HttpStatus from '@/enum/HttpStatus'

import BaseException from './BaseExceptions'

export class BanWordAlreadyExistsException extends BaseException {
  constructor(message = 'Ban word already exists') {
    super(message, HttpStatus.CONFLICT)
  }
}

export class BanWordNotFoundException extends BaseException {
  constructor(message = 'Ban word not found') {
    super(message, HttpStatus.NOT_FOUND)
  }
}

export class BannedContentException extends BaseException {
  constructor(message = 'This object contains banned words') {
    super(message, HttpStatus.FORBIDDEN)
  }
}