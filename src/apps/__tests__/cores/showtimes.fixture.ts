import type { AppTestContext } from 'apps/__tests__/__helpers__'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { ShowtimesModule, ShowtimesService } from 'apps/cores'

export type ShowtimesFixture = AppTestContext & { showtimesService: ShowtimesService }

export async function createShowtimesFixture() {
    const ctx = await createAppTestContext({ imports: [ShowtimesModule] })

    const showtimesService = ctx.module.get(ShowtimesService)

    return { ...ctx, showtimesService }
}
