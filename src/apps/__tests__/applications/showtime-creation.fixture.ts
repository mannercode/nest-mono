import type { AppTestContext as TestContext } from 'apps/__tests__/__helpers__'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { ShowtimeCreationModule } from 'apps/applications'
import {
    MoviesModule,
    ShowtimesModule,
    ShowtimesService,
    TheatersModule,
    TicketsModule,
    TicketsService
} from 'apps/cores'
import { ShowtimeCreationHttpController } from 'apps/gateway'
import { AssetsModule } from 'apps/infrastructures'
import { Json } from 'common'

export type ShowtimeCreationFixture = TestContext & {
    showtimesService: ShowtimesService
    ticketsService: TicketsService
}

export async function createShowtimeCreationFixture(): Promise<ShowtimeCreationFixture> {
    const ctx = await createAppTestContext({
        controllers: [ShowtimeCreationHttpController],
        imports: [
            MoviesModule,
            AssetsModule,
            TheatersModule,
            ShowtimesModule,
            TicketsModule,
            ShowtimeCreationModule
        ]
    })

    const showtimesService = ctx.module.get(ShowtimesService)
    const ticketsService = ctx.module.get(TicketsService)

    return { ...ctx, showtimesService, ticketsService }
}

export function waitForCompletion(ctx: TestContext, status: string) {
    return new Promise<any>((resolve, reject) => {
        ctx.httpClient.get('/showtime-creation/event-stream').sse((data) => {
            try {
                const statusUpdate = Json.reviveIsoDates(JSON.parse(data))

                if (['error', 'failed', 'succeeded'].includes(statusUpdate.status)) {
                    ctx.httpClient.abort()

                    if (status === statusUpdate.status) {
                        resolve(statusUpdate)
                    } else {
                        reject(statusUpdate)
                    }
                }
            } catch (error) {
                ctx.httpClient.abort()
                reject(error)
            }
        }, reject)
    })
}
