import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { CampaignDetail } from './entities/campaign-detail.entity';
import { CampaignNews } from './entities/campaign-news.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignDetail, CampaignNews])
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService, TypeOrmModule]
})
export class CampaignsModule {}
