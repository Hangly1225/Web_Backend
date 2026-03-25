import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<{
      method?: string;
      path?: string;
      headers?: Record<string, string | string[] | undefined>;
    }>();
    const response = http.getResponse<{
      setHeader: (name: string, value: string) => void;
      status: (code: number) => { end: () => void };
    }>();

    const isGet = request.method === 'GET';
    const isApiRequest = (request.path ?? '').startsWith('/api/');

    if (!isGet || !isApiRequest) {
      return next.handle();
    }

    return next.handle().pipe( 
      map((data) => {
        const body = JSON.stringify(data);
        const etag = `W/\"${createHash('sha1').update(body).digest('hex')}\"`;
        const ifNoneMatch = request.headers?.['if-none-match'];
        const headerValue = Array.isArray(ifNoneMatch)
          ? ifNoneMatch.join(', ')
          : ifNoneMatch;

        response.setHeader('ETag', etag);

        if (headerValue === etag) {
          response.status(304).end();
          return undefined;
        }

        return data;
      }),
    );
  }
}