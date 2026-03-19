import { LatLong } from '@mannercode/nest-common'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class BookingSearchTheatersDto {
    @IsNotEmpty()
    @ValidateNested()
    latLong: LatLong

    @IsNotEmpty()
    @IsString()
    movieId: string
}
