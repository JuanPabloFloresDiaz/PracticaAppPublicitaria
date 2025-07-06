import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignNewsDto } from './create-campaign-news.dto';

export class UpdateCampaignNewsDto extends PartialType(CreateCampaignNewsDto) {}