import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ApplicationsModule } from 'apps/applications'
import { CoresModule } from 'apps/cores'
import { InfrastructuresModule } from 'apps/infrastructures'
import { CommonModule, MongooseConfigModule, RedisConfigModule } from 'shared'
import {
    BookingHttpController,
    CustomerJwtStrategy,
    CustomerLocalStrategy,
    CustomersHttpController,
    MoviesHttpController,
    PurchaseHttpController,
    ShowtimeCreationHttpController,
    TheatersHttpController
} from './controllers'
import { HealthModule } from './modules'

@Module({
    controllers: [
        CustomersHttpController,
        MoviesHttpController,
        TheatersHttpController,
        ShowtimeCreationHttpController,
        BookingHttpController,
        PurchaseHttpController
    ],
    imports: [
        CommonModule,
        MongooseConfigModule,
        RedisConfigModule,
        EventEmitterModule.forRoot(),
        HealthModule,
        CoresModule,
        InfrastructuresModule,
        ApplicationsModule
    ],
    providers: [CustomerLocalStrategy, CustomerJwtStrategy]
})
export class GatewayModule {}
