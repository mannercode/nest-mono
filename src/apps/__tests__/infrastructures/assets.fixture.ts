import type { AppTestContext } from 'apps/__tests__/__helpers__'
import { SchedulerRegistry } from '@nestjs/schedule'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { AssetsModule, AssetsService } from 'apps/infrastructures'

export type AssetsFixture = AppTestContext & {
    assetsService: AssetsService
    scheduler: SchedulerRegistry
}

export async function createAssetsFixture() {
    const ctx = await createAppTestContext({ imports: [AssetsModule] })

    const assetsService = ctx.module.get(AssetsService)
    const scheduler = ctx.module.get(SchedulerRegistry)

    return { ...ctx, assetsService, scheduler }
}
