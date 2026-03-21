import { CommonErrors } from '@mannercode/nest-common'
import { SharedErrors } from 'app-common'
import { ApplicationErrors } from 'applications'
import { CoreErrors } from 'cores'
import { AppErrors } from '../../errors'

export const Errors = {
    ...CommonErrors,
    ...SharedErrors,
    ...AppErrors,
    ...ApplicationErrors,
    ...CoreErrors
}
