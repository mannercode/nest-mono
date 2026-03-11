import { Provider } from '@nestjs/common'
import { Controller, Get, Post } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { SuccessLoggerInterceptor } from 'common'
import { HttpTestClient } from 'testlib'
import { createHttpTestContext } from 'testlib'

export type SuccessLoggerInterceptorFixture = {
    httpClient: HttpTestClient
    spyError: jest.SpyInstance
    spyVerbose: jest.SpyInstance
    teardown: () => Promise<void>
}

@Controller()
class TestController {
    @Get('exclude-path')
    async getExcludePath() {
        return { result: 'success' }
    }

    @Post('success')
    async httpSuccess() {
        return { result: 'success' }
    }
}

export async function createSuccessLoggerInterceptorFixture(providers: Provider[]) {
    const { httpClient, ...ctx } = await createHttpTestContext({
        controllers: [TestController],
        providers: [{ provide: APP_INTERCEPTOR, useClass: SuccessLoggerInterceptor }, ...providers]
    })

    const { Logger } = await import('@nestjs/common')
    const spyVerbose = jest.spyOn(Logger, 'verbose')
    const spyError = jest.spyOn(Logger, 'error')

    const teardown = async () => {
        await ctx.close()
    }

    return { httpClient, spyError, spyVerbose, teardown }
}
