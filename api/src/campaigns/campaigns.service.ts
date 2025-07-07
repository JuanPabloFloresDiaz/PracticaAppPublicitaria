import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CampaignDetail } from './entities/campaign-detail.entity';
import { CampaignNews } from './entities/campaign-news.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCampaignDetailDto } from './dto/create-campaign-detail.dto';
import { UpdateCampaignDetailDto } from './dto/update-campaign-detail.dto';
import { CreateCampaignNewsDto } from './dto/create-campaign-news.dto';
import { UpdateCampaignNewsDto } from './dto/update-campaign-news.dto';

@Injectable()
export class CampaignsService {
    constructor(
        // Inyección de repostorio de campañas, detalles y noticias
        @InjectRepository(Campaign)
        private campaignRepository: Repository<Campaign>,
        @InjectRepository(CampaignDetail)
        private campaignDetailRepository: Repository<CampaignDetail>,
        @InjectRepository(CampaignNews)
        private campaignNewsRepository: Repository<CampaignNews>,
    ) { }

    // Campaign CRUD
    // Método para crear una campaña
    async createCampaign(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
        const campaign = this.campaignRepository.create(createCampaignDto);
        return await this.campaignRepository.save(campaign);
    }
    // Métodos para obtener campañas
    async findAllCampaigns(): Promise<Campaign[]> {
        return await this.campaignRepository.find({
            relations: ['details', 'news'],
        });
    }
    // Método para encontrar una campaña por ID
    async findOneCampaign(id: string): Promise<Campaign> {
        const campaign = await this.campaignRepository.findOne({
            where: { id },
            relations: ['details', 'news'],
        });

        if (!campaign) {
            throw new NotFoundException(`Campaign with ID ${id} not found`);
        }

        return campaign;
    }
    // Método para actualizar una campaña
    async updateCampaign(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
        await this.campaignRepository.update(id, updateCampaignDto);
        return this.findOneCampaign(id);
    }
    // Método para eliminar una campaña
    async removeCampaign(id: string): Promise<void> {
        const result = await this.campaignRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Campaign with ID ${id} not found`);
        }
    }

    // Campaign Detail CRUD
    // Método para crear un detalle de campaña
    async createCampaignDetail(createCampaignDetailDto: CreateCampaignDetailDto): Promise<CampaignDetail> {
        // Verificar que existe la campaña
        await this.findOneCampaign(createCampaignDetailDto.campaign_id);

        const detail = this.campaignDetailRepository.create(createCampaignDetailDto);
        return await this.campaignDetailRepository.save(detail);
    }
    // Métodos para obtener detalles de campañas
    async findAllCampaignDetails(): Promise<CampaignDetail[]> {
        return await this.campaignDetailRepository.find({
            relations: ['campaign'],
        });
    }
    // Método para encontrar un detalle de campaña por ID
    async findOneCampaignDetail(id: string): Promise<CampaignDetail> {
        const detail = await this.campaignDetailRepository.findOne({
            where: { id },
            relations: ['campaign'],
        });

        if (!detail) {
            throw new NotFoundException(`Campaign Detail with ID ${id} not found`);
        }

        return detail;
    }
    // Método para actualizar un detalle de campaña
    async updateCampaignDetail(id: string, updateCampaignDetailDto: UpdateCampaignDetailDto): Promise<CampaignDetail> {
        await this.campaignDetailRepository.update(id, updateCampaignDetailDto);
        return this.findOneCampaignDetail(id);
    }
    // Método para eliminar un detalle de campaña
    async removeCampaignDetail(id: string): Promise<void> {
        const result = await this.campaignDetailRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Campaign Detail with ID ${id} not found`);
        }
    }

    // Campaign News CRUD
    // Método para crear una noticia de campaña
    async createCampaignNews(createCampaignNewsDto: CreateCampaignNewsDto): Promise<CampaignNews> {
        // Verificar que existe la campaña
        await this.findOneCampaign(createCampaignNewsDto.campaign_id);

        const news = this.campaignNewsRepository.create(createCampaignNewsDto);
        return await this.campaignNewsRepository.save(news);
    }
    // Métodos para obtener noticias de campañas
    async findAllCampaignNews(): Promise<CampaignNews[]> {
        return await this.campaignNewsRepository.find({
            relations: ['campaign'],
        });
    }
    // Método para encontrar noticias de campañas públicas
    async findPublicCampaignNews(): Promise<CampaignNews[]> {
        return await this.campaignNewsRepository.find({
            where: { is_public: true },
            relations: ['campaign'],
        });
    }
    // Método para encontrar una noticia de campaña por ID
    async findOneCampaignNews(id: string): Promise<CampaignNews> {
        const news = await this.campaignNewsRepository.findOne({
            where: { id },
            relations: ['campaign'],
        });

        if (!news) {
            throw new NotFoundException(`Campaign News with ID ${id} not found`);
        }

        return news;
    }
    // Método para actualizar una noticia de campaña
    async updateCampaignNews(id: string, updateCampaignNewsDto: UpdateCampaignNewsDto): Promise<CampaignNews> {
        await this.campaignNewsRepository.update(id, updateCampaignNewsDto);
        return this.findOneCampaignNews(id);
    }
    // Método para eliminar una noticia de campaña
    async removeCampaignNews(id: string): Promise<void> {
        const result = await this.campaignNewsRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Campaign News with ID ${id} not found`);
        }
    }

    // Métodos adicionales útiles
    // Método para encontrar campañas por rango de fechas
    async findCampaignsByDateRange(startDate: Date, endDate: Date): Promise<Campaign[]> {
        return await this.campaignRepository
            .createQueryBuilder('campaign')
            .where('campaign.start_date >= :startDate', { startDate })
            .andWhere('campaign.end_date <= :endDate', { endDate })
            .getMany();
    }
    // Método para encontrar campañas por nombre
    async findNewsByCampaign(campaignId: string): Promise<CampaignNews[]> {
        return await this.campaignNewsRepository.find({
            where: { campaign_id: campaignId },
            relations: ['campaign'],
        });
    }
    // Método para encontrar detalles de campaña por ID
    async findDetailsByCampaign(campaignId: string): Promise<CampaignDetail[]> {
        return await this.campaignDetailRepository.find({
            where: { campaign_id: campaignId },
            relations: ['campaign'],
        });
    }
}
