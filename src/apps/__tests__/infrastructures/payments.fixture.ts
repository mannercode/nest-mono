import type { AppTestContext } from 'apps/__tests__/__helpers__'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { PaymentsModule, PaymentsService } from 'apps/infrastructures'

export type PaymentsFixture = AppTestContext & { paymentsService: PaymentsService }

export async function createPaymentsFixture() {
    const ctx = await createAppTestContext({
        imports: [PaymentsModule]
    })

    const paymentsService = ctx.module.get(PaymentsService)

    return { ...ctx, paymentsService }
}
