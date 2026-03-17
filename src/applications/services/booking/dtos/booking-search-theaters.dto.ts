import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { LatLong } from 'common'

export class BookingSearchTheatersDto {
    @IsNotEmpty()
    @ValidateNested()
    latLong: LatLong

    @IsNotEmpty()
    @IsString()
    movieId: string
}
