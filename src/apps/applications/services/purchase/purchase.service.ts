import { Injectable } from '@nestjs/common'
import { PurchaseRecordsService } from 'apps/cores'
import { PaymentsService } from 'apps/infrastructures'
import { CreatePurchaseDto } from './dtos'
import { TicketPurchaseService } from './services'

@Injectable()
export class PurchaseService {
    constructor(
        private readonly purchaseRecordsService: PurchaseRecordsService,
        private readonly paymentsService: PaymentsService,
        private readonly ticketPurchaseService: TicketPurchaseService
    ) {}

    async processPurchase(createDto: CreatePurchaseDto) {
        await this.ticketPurchaseService.validatePurchase(createDto)

        const payment = await this.paymentsService.create({
            amount: createDto.totalPrice,
            customerId: createDto.customerId
        })

        let purchaseRecord
        try {
            purchaseRecord = await this.purchaseRecordsService.create({
                ...createDto,
                paymentId: payment.id
            })
        } catch (error) {
            await this.paymentsService.cancel(payment.id)
            throw error
        }

        try {
            await this.ticketPurchaseService.completePurchase(createDto)
            return purchaseRecord
        } catch (error) {
            await this.ticketPurchaseService.rollbackPurchase(createDto)
            await this.purchaseRecordsService.delete(purchaseRecord.id)
            await this.paymentsService.cancel(payment.id)
            throw error
        }
    }
}
