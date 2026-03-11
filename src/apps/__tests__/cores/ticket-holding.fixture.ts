import type { AppTestContext } from 'apps/__tests__/__helpers__'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { TicketHoldingModule, TicketHoldingService } from 'apps/cores'

export type TicketHoldingFixture = AppTestContext & { ticketHoldingService: TicketHoldingService }

export async function createTicketHoldingFixture() {
    const ctx = await createAppTestContext({
        imports: [TicketHoldingModule]
    })

    const ticketHoldingService = ctx.module.get(TicketHoldingService)

    return { ...ctx, ticketHoldingService }
}
