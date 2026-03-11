import { BadRequestException } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator'

export const PaginationErrors = {
    DirectionInvalid: () => ({
        code: 'ERR_PAGINATION_ORDERBY_DIRECTION_INVALID',
        message: 'Invalid direction. It should be either "asc" or "desc".'
    }),
    FormatInvalid: () => ({
        code: 'ERR_PAGINATION_ORDERBY_FORMAT_INVALID',
        message: "Invalid orderby format. It should be 'name:direction'"
    })
}

export enum OrderDirection {
    Asc = 'asc',
    Desc = 'desc'
}

export class OrderBy {
    @IsEnum(OrderDirection)
    direction: OrderDirection

    @IsString()
    name: string
}

export class PaginationDto {
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null) {
            return value
        }

        if (typeof value !== 'string') {
            throw new BadRequestException(PaginationErrors.FormatInvalid())
        }

        const parts = value.split(':').map((part) => part.trim())

        if (parts.length !== 2) {
            throw new BadRequestException(PaginationErrors.FormatInvalid())
        }

        const [name, direction] = parts

        if (!name || !direction) {
            throw new BadRequestException(PaginationErrors.FormatInvalid())
        }

        const parsedDirection = direction as OrderDirection
        if (!Object.values(OrderDirection).includes(parsedDirection)) {
            throw new BadRequestException(PaginationErrors.DirectionInvalid())
        }

        return { direction: parsedDirection, name }
    })
    orderby?: OrderBy

    @IsInt()
    @IsOptional()
    @Min(0)
    skip?: number

    @IsOptional()
    @IsPositive()
    take?: number
}

export class PaginationResult<E> {
    items: E[]

    @IsInt()
    skip: number

    @IsInt()
    take: number

    @IsInt()
    total: number
}
