import { Controller, Get, NotFoundException } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ExceptionLoggerFilter } from 'common'
import { HttpTestClient } from 'testlib'
import { createHttpTestContext } from 'testlib'

export type ExceptionLoggerFilterFixture = {
    httpClient: HttpTestClient
    spyError: jest.SpyInstance
    spyFatal: jest.SpyInstance
    spyWarn: jest.SpyInstance
    teardown: () => Promise<void>
}

@Controller()
class TestController {
    @Get('error')
    getHttpError() {
        throw new Error('error message')
    }

    @Get('exception')
    getHttpException() {
        throw new NotFoundException({ code: 'ERR_CODE', message: 'message' })
    }

    @Get('fatal')
    getHttpFatalError() {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 'fatal error message'
    }
}

export async function createExceptionLoggerFilterFixture() {
    const { httpClient, ...ctx } = await createHttpTestContext({
        controllers: [TestController],
        providers: [{ provide: APP_FILTER, useClass: ExceptionLoggerFilter }]
    })

    const { Logger } = await import('@nestjs/common')
    const spyWarn = jest.spyOn(Logger, 'warn')
    const spyError = jest.spyOn(Logger, 'error')
    const spyFatal = jest.spyOn(Logger, 'fatal')

    const teardown = async () => {
        await ctx.close()
    }

    return { httpClient, spyError, spyFatal, spyWarn, teardown }
}
