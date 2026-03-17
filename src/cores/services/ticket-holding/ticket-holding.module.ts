import { Module } from '@nestjs/common'
import { CacheModule } from 'common'
import { getProjectId, RedisConfigModule } from 'shared'
import { TicketHoldingService } from './ticket-holding.service'

@Module({
    exports: [TicketHoldingService],
    imports: [
        CacheModule.register({
            name: 'ticket-holding',
            prefix: `cache:${getProjectId()}`,
            redisName: RedisConfigModule.connectionName
        })
    ],
    providers: [TicketHoldingService]
})
export class TicketHoldingModule {}
