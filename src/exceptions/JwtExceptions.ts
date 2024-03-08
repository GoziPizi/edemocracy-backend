import HttpStatus from '@/enum/HttpStatus'

import BaseException from './BaseExceptions'

abstract class JwtException extends BaseException {
  constructor(message: string, httpCode: HttpStatus) {
    super(message, httpCode)
  }
}

export class JwtCheckException extends JwtException {
  constructor(message = 'JWT is not valid') {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}

export class JwtNotInHeaderException extends JwtException {
  constructor() {
    super('JWT not in header', HttpStatus.UNAUTHORIZED)
  }
}

export class JwtMalfomedException extends JwtException {
  constructor() {
    super('JWT is malformed', HttpStatus.UNAUTHORIZED)
  }
}
