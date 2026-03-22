import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { Request } from 'express';
  import { map, tap } from 'rxjs/operators';
  
  @Injectable()
  export class RequestTimingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
      if (context.getType() !== 'http') {
        return next.handle();
      }
  
      const http = context.switchToHttp();
      const request = http.getRequest<Request & { accepts?: (type: string) => boolean }>();
      const response = http.getResponse<{ setHeader: (name: string, value: string) => void }>();
      const startedAt = performance.now();
      const requestPath = (request as { path?: string }).path ?? '';
      const wantsHtml = Boolean(request.accepts?.('html')) && !requestPath.startsWith('/api/');
  
      return next.handle().pipe(
        map((data) => {
          const elapsedTimeMs = Number((performance.now() - startedAt).toFixed(2));
  
          if (
            wantsHtml &&
            data !== null &&
            typeof data === 'object' &&
            !Array.isArray(data)
          ) {
            return {
              ...(data as Record<string, unknown>),
              elapsedTimeMs,
            };
          }
  
          return data;
        }),
        tap(() => {
          const elapsedTimeMs = Number((performance.now() - startedAt).toFixed(2));
          response.setHeader('X-Elapsed-Time', `${elapsedTimeMs}ms`);
        }),
      );
    }
  }