import { NestFactory } from '@nestjs/core'
import { configureApp } from 'shared'
import { GatewayModule } from './gateway.module'

export async function bootstrap() {
    const app = await NestFactory.create(GatewayModule)

    await configureApp({ app })

    console.log(`Application is running on: ${await app.getUrl()}`)
}
