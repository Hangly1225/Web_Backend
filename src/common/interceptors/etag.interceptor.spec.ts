import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { EtagInterceptor } from './etag.interceptor';

describe('EtagInterceptor', () => {
  it('sets an ETag header for API GET responses', async () => {
    const interceptor = new EtagInterceptor();
    const setHeader = jest.fn();
    const status = jest.fn().mockReturnValue({ end: jest.fn() });

    const context = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          path: '/api/products',
          headers: {},
        }),
        getResponse: () => ({ setHeader, status }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: () => of({ data: [{ id: 1 }] }),
    };

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual({ data: [{ id: 1 }] });
    expect(setHeader).toHaveBeenCalledWith(
      'ETag',
      expect.stringMatching(/^W\/"[a-f0-9]+"$/),
    );
    expect(status).not.toHaveBeenCalled();
  });
});
