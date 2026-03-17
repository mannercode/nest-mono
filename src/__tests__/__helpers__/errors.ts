import { ApplicationErrors } from 'applications'
import { CommonErrors } from 'common'
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
