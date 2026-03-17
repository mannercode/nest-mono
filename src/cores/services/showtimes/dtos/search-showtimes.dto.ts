import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { PartialDateTimeRange } from 'common'

export class SearchShowtimesDto {
    @IsOptional()
    @ValidateNested()
    endTimeRange?: PartialDateTimeRange

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    movieIds?: string[]

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    sagaIds?: string[]

    @IsOptional()
    @ValidateNested()
    startTimeRange?: PartialDateTimeRange

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    theaterIds?: string[]
}
