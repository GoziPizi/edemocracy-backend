import HttpStatus from "@/enum/HttpStatus";
import BaseException from "./BaseExceptions";


abstract class LoginException extends BaseException {
    constructor(message: string, httpCode: HttpStatus) {
      super(message, httpCode)
    }
}

export class NoIdentityCardException extends LoginException {
    constructor() {
        super('Recto, verso and id number are required', HttpStatus.BAD_REQUEST)
    }
}

export class EmailAlreadyExistsException extends LoginException {
    constructor() {
        super('Email already exists', HttpStatus.BAD_REQUEST)
    }
}

export class InvalidRegisterTypeException extends LoginException {
    constructor() {
        super('Invalid register type', HttpStatus.BAD_REQUEST)
    }
}

