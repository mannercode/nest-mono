import type { AppTestContext } from 'apps/__tests__/__helpers__'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { PurchaseModule } from 'apps/applications'
import { PurchaseRecordsModule, PurchaseRecordsService } from 'apps/cores'
import { PurchaseHttpController } from 'apps/gateway'

export type PurchaseRecordsFixture = AppTestContext & {
    purchaseRecordsService: PurchaseRecordsService
}

export async function createPurchaseRecordsFixture(): Promise<PurchaseRecordsFixture> {
    const ctx = await createAppTestContext({
        controllers: [PurchaseHttpController],
        imports: [PurchaseRecordsModule, PurchaseModule]
    })

    const purchaseRecordsService = ctx.module.get(PurchaseRecordsService)
    return { ...ctx, purchaseRecordsService }
}
