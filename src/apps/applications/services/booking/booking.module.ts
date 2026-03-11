import { Module } from '@nestjs/common'
import { ShowtimesModule, TheatersModule, TicketHoldingModule, TicketsModule } from 'apps/cores'
import { BookingService } from './booking.service'

@Module({
    exports: [BookingService],
    imports: [ShowtimesModule, TheatersModule, TicketHoldingModule, TicketsModule],
    providers: [BookingService]
})
export class BookingModule {}
