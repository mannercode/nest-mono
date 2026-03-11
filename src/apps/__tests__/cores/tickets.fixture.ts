import type { AppTestContext } from 'apps/__tests__/__helpers__'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { TicketsModule, TicketsService } from 'apps/cores'

export type TicketsFixture = AppTestContext & { ticketsService: TicketsService }

export async function createTicketsFixture() {
    const ctx = await createAppTestContext({ imports: [TicketsModule] })

    const ticketsService = ctx.module.get(TicketsService)

    return { ...ctx, ticketsService }
}
