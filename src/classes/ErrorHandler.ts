import { Request, Response } from 'express'

import BaseException from '@/exceptions/BaseExceptions'
import { ErrorResponseFormat } from '@/types/Error'

import Logger from './Logger'

class ErrorHandler {
  handleError = async (err: Error, req: Request, res: Response) => {
    await new Logger().error(err)
    const isTrustedError = await this.isTrustedError(err)
    if (isTrustedError) {
      res.status((err as BaseException).httpCode).json(this.getErrorResponseFormat(err))
    } else {
      this.handleUnknownError(err, res)
    }
  }

  private getErrorResponseFormat = (err: Error): ErrorResponseFormat => {
    return { errorName: err.name, error: err.message }
  }

  private handleUnknownError = (err: Error, res: Response): void => {
    res.status(500).json(this.getErrorResponseFormat(err))
  }

  private isTrustedError = async (error: Error) => {
    if (error instanceof BaseException) {
      return true
    }
    return false
  }
}

const HandlerError = new ErrorHandler()
export default HandlerError
