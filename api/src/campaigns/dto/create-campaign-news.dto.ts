import { IsString, IsOptional, IsUUID, IsBoolean, IsObject, IsUrl } from 'class-validator';
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
    @IsObject()
    tags?: Record<string, any>;

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