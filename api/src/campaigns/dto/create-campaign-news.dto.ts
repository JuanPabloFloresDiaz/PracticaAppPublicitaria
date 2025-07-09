import { IsString, IsOptional, IsUUID, IsBoolean, IsArray, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCampaignNewsDto {
    @IsUUID()
    campaign_id: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    subtitle?: string;

    @IsUrl()
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsUrl()
    @IsOptional()
    @IsString()
    hero_image?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_public?: boolean;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    author?: string;
}