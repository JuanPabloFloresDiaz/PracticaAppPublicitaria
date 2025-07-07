import { IsString, IsOptional, IsDateString, IsNumber, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCampaignDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    start_date?: string;

    @IsOptional()
    @IsDateString()
    end_date?: string;

    @IsPositive()
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    budget?: number;
}