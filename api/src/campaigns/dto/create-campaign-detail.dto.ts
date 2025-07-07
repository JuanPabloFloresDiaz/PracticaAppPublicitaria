import { IsString, IsUUID } from 'class-validator';

export class CreateCampaignDetailDto {
    @IsUUID()
    campaign_id: string;

    @IsString()
    description: string;

    @IsString()
    extra_info: string;
}