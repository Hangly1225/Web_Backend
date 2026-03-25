import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, lastValueFrom } from 'rxjs';
import { RequestTimingInterceptor } from './request-timing.interceptor';

describe('RequestTimingInterceptor', () => {
  it('adds elapsedTimeMs to HTML view models and sets the response header', async () => {
    const interceptor = new RequestTimingInterceptor();
    const setHeader = jest.fn();

    const context = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          path: '/',
          accepts: (type: string) => type === 'html',
        }),
        getResponse: () => ({ setHeader }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: () => of({ pageTitle: 'Home' }),
    };

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual(
      expect.objectContaining({
        pageTitle: 'Home',
        elapsedTimeMs: expect.any(Number),
      }),
    );
    expect(setHeader).toHaveBeenCalledWith(
      'X-Elapsed-Time',
      expect.stringMatching(/ms$/),
    );
  });

  it('does not set headers when response has already been sent', async () => {
    const interceptor = new RequestTimingInterceptor();
    const setHeader = jest.fn();

    const context = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          path: '/login',
          accepts: (type: string) => type === 'html',
        }),
        getResponse: () => ({
          setHeader,
          headersSent: true,
          writableEnded: true,
        }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: () => of(undefined),
    };

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toBeUndefined();
    expect(setHeader).not.toHaveBeenCalled();
  });
});
