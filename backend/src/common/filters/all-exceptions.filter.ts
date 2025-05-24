import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('EXCEPTION FILTER - Request path:', request.path);
    console.log('EXCEPTION FILTER - Request method:', request.method);
    console.log('EXCEPTION FILTER - Request body:', JSON.stringify(request.body, null, 2));
    console.log('EXCEPTION FILTER - Request params:', JSON.stringify(request.params, null, 2));
    console.log('EXCEPTION FILTER - Request query:', JSON.stringify(request.query, null, 2));

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let error = exception;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || 'HttpException';
        
        console.log('EXCEPTION FILTER - HttpException details:', {
          status,
          error,
          message,
        });
      } else {
        message = exception.message;
        console.log('EXCEPTION FILTER - HttpException message:', message);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      console.log('EXCEPTION FILTER - Error message:', message);
      console.log('EXCEPTION FILTER - Error stack:', exception.stack);
    } else {
      console.log('EXCEPTION FILTER - Unknown exception:', exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: error,
      message: message,
    });
  }
}
