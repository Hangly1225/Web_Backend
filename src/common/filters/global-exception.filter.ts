import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : 'Internal server error';
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : ((exceptionResponse as { message?: string | string[] }).message ??
          'Unexpected error');

    const normalizedMessage = Array.isArray(message)
      ? message.join(', ')
      : message;
    const acceptHeader = request.headers.accept ?? '';
    const wantsHtml = acceptHeader.includes('text/html');
    const isApiRequest = request.path.startsWith('/api/');

    if (wantsHtml && !isApiRequest) {
      return response.status(status).render('errors/error', {
        pageTitle: `Error ${status}`,
        errorTitle: `Error ${status}`,
        errorMessage: normalizedMessage,
      });
    }

    return response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message: normalizedMessage,
    });
  }
}