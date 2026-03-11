import type { AppTestContext } from 'apps/__tests__/__helpers__'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { WatchRecordsModule, WatchRecordsService } from 'apps/cores'

export type WatchRecordsFixture = AppTestContext & { watchRecordsService: WatchRecordsService }

export async function createWatchRecordsFixture() {
    const ctx = await createAppTestContext({
        imports: [WatchRecordsModule]
    })

    const watchRecordsService = ctx.module.get(WatchRecordsService)

    return { ...ctx, watchRecordsService }
}
