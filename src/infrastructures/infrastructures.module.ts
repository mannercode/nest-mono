import { Module } from '@nestjs/common'
import { CommonModule } from 'app-common'
import { AssetsModule, PaymentsModule } from './services'

@Module({
    imports: [CommonModule, PaymentsModule, AssetsModule],
    exports: [PaymentsModule, AssetsModule]
})
export class InfrastructuresModule {}
