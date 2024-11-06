import HttpStatus from '@/enum/HttpStatus'

import BaseException from './BaseExceptions'

abstract class AdminException extends BaseException {
    constructor(message: string, httpCode: HttpStatus) {
        super(message, httpCode)
    }
}

export class AdminNotFoundException extends AdminException {
    constructor() {
        super('Admin not found', HttpStatus.NOT_FOUND)
    }
}

export class Forbidden extends AdminException {
    constructor() {
        super('Forbidden', HttpStatus.FORBIDDEN)
    }
}