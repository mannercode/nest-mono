import { Module } from '@nestjs/common'
import {
    PurchaseRecordsModule,
    ShowtimesModule,
    TicketHoldingModule,
    TicketsModule
} from 'apps/cores'
import { PaymentsModule } from 'apps/infrastructures'
import { PurchaseEvents } from './purchase.events'
import { PurchaseService } from './purchase.service'
import { TicketPurchaseService } from './services'

@Module({
    exports: [PurchaseService],
    imports: [TicketsModule, TicketHoldingModule, PurchaseRecordsModule, ShowtimesModule, PaymentsModule],
    providers: [PurchaseService, TicketPurchaseService, PurchaseEvents]
})
export class PurchaseModule {}
