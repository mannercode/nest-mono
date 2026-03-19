import { CommonErrors } from '@mannercode/nest-common'
import { ApplicationErrors } from 'applications'
import { CoreErrors } from 'cores'
import { SharedErrors } from 'shared'
import { AppErrors } from '../../errors'

export const Errors = {
    ...CommonErrors,
    ...SharedErrors,
    ...AppErrors,
    ...ApplicationErrors,
    ...CoreErrors
}
