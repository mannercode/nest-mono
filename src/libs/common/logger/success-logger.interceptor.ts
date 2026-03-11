import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Inject, Injectable, Logger, Optional } from '@nestjs/common'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { HttpSuccessLog } from './types'

@Injectable()
export class SuccessLoggerInterceptor implements NestInterceptor {
    constructor(
        @Optional()
        @Inject('LOGGING_EXCLUDE_HTTP_PATHS')
        private readonly excludeHttpPaths: string[] | undefined
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const startTimestamp = Date.now()

        return next.handle().pipe(
            tap({
                complete: () => {
                    const elapsedMs = Date.now() - startTimestamp

                    const httpContext = context.switchToHttp()
                    const response = httpContext.getResponse<Response>()
                    const { body, method, url } = httpContext.getRequest<Request>()

                    if (this.shouldLogHttp(url)) {
                        const successLog = {
                            contextType: 'http',
                            duration: `${elapsedMs}ms`,
                            request: { body, method, url },
                            statusCode: response.statusCode
                        } as HttpSuccessLog

                        Logger.verbose('success', successLog)
                    }
                }
            })
        )
    }

    private shouldLogHttp(url: string): boolean {
        if (this.excludeHttpPaths === undefined) return true

        return !this.excludeHttpPaths.some((exclude) => url === exclude)
    }
}
