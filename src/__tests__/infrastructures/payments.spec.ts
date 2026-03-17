import type { PaymentDto } from 'infrastructures'
import { HttpStatus } from '@nestjs/common'
import { pickIds } from 'common'
import { nullObjectId } from 'testlib'
import type { PaymentsFixture } from './payments.fixture'
import { buildCreatePaymentDto, createPayment, Errors } from '../__helpers__'

describe('PaymentsService', () => {
    let fix: PaymentsFixture

    beforeEach(async () => {
        const { createPaymentsFixture } = await import('./payments.fixture')
        fix = await createPaymentsFixture()
    })
    afterEach(() => fix.teardown())

    describe('cancel', () => {
        // 결제를 취소한다
        it('cancels the payment', async () => {
            const payment = await createPayment(fix)

            await fix.paymentsService.cancel(payment.id)

            const promise = fix.paymentsService.getMany([payment.id])

            await expect(promise).rejects.toMatchObject({
                message: Errors.Mongoose.MultipleDocumentsNotFound([payment.id]).message,
                status: HttpStatus.NOT_FOUND
            })
        })
    })

    describe('create', () => {
        // 생성된 결제를 반환한다
        it('returns the created payment', async () => {
            const createDto = buildCreatePaymentDto()

            const payment = await fix.paymentsService.create(createDto)

            expect(payment).toEqual({
                ...createDto,
                createdAt: expect.any(Date),
                id: expect.any(String),
                updatedAt: expect.any(Date)
            })
        })
    })

    describe('getMany', () => {
        // 결제가 존재할 때
        describe('when the payments exist', () => {
            let payments: PaymentDto[]

            beforeEach(async () => {
                payments = await Promise.all([
                    createPayment(fix),
                    createPayment(fix),
                    createPayment(fix)
                ])
            })

            // paymentIds에 대한 결제를 반환한다
            it('returns payments for the paymentIds', async () => {
                const fetchedPayments = await fix.paymentsService.getMany(pickIds(payments))

                expect(fetchedPayments).toEqual(expect.arrayContaining(payments))
            })
        })

        // paymentIds에 존재하지 않는 paymentId가 포함될 때
        describe('when the paymentIds include a non-existent paymentId', () => {
            // 404 Not Found를 던진다
            it('throws 404 Not Found', async () => {
                const promise = fix.paymentsService.getMany([nullObjectId])

                await expect(promise).rejects.toMatchObject({
                    message: Errors.Mongoose.MultipleDocumentsNotFound([nullObjectId]).message,
                    status: HttpStatus.NOT_FOUND
                })
            })
        })
    })
})
