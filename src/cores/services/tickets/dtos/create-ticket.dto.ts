import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Seat } from '../../theaters'
import { TicketStatus } from '../models'

export class CreateTicketDto {
    @IsNotEmpty()
    @IsString()
    movieId: string

    @IsNotEmpty()
    @IsString()
    sagaId: string

    @IsNotEmpty()
    @ValidateNested()
    seat: Seat

    @IsNotEmpty()
    @IsString()
    showtimeId: string

    @IsEnum(TicketStatus)
    status: TicketStatus

    @IsNotEmpty()
    @IsString()
    theaterId: string
}
