import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCampaignDetailDto } from './dto/create-campaign-detail.dto';
import { UpdateCampaignDetailDto } from './dto/update-campaign-detail.dto';
import { CreateCampaignNewsDto } from './dto/create-campaign-news.dto';
import { UpdateCampaignNewsDto } from './dto/update-campaign-news.dto';

@Controller('campaigns')
export class CampaignsController {
    constructor(private readonly campaignsService: CampaignsService) { }

    // Endpoints para campañas
    // Crear campaña
    @Post()
    createCampaign(@Body(ValidationPipe) createCampaignDto: CreateCampaignDto) {
        return this.campaignsService.createCampaign(createCampaignDto);
    }

    // Obtener todas las campañas
    @Get()
    findAllCampaigns() {
        return this.campaignsService.findAllCampaigns();
    }

    // Obtener una campaña por ID
    @Get(':id')
    findOneCampaign(@Param('id', ParseUUIDPipe) id: string) {
        return this.campaignsService.findOneCampaign(id);
    }

    // Actualizar una campaña
    @Patch(':id')
    updateCampaign(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) updateCampaignDto: UpdateCampaignDto,
    ) {
        return this.campaignsService.updateCampaign(id, updateCampaignDto);
    }

    // Eliminar una campaña
    @Delete(':id')
    removeCampaign(@Param('id', ParseUUIDPipe) id: string) {
        return this.campaignsService.removeCampaign(id);
    }

    // Endpoints para detalles de campañas
    // Crear detalle de campaña
    @Post('details')
    createCampaignDetail(@Body(ValidationPipe) createCampaignDetailDto: CreateCampaignDetailDto) {
        return this.campaignsService.createCampaignDetail(createCampaignDetailDto);
    }
    // Obtener todos los detalles de campañas
    @Get('details')
    findAllCampaignDetails() {
        return this.campaignsService.findAllCampaignDetails();
    }
    // Obtener un detalle de campaña por ID
    @Get('details/:id')
    findOneCampaignDetail(@Param('id', ParseUUIDPipe) id: string) {
        return this.campaignsService.findOneCampaignDetail(id);
    }
    // Actualizar un detalle de campaña
    @Patch('details/:id')
    updateCampaignDetail(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) updateCampaignDetailDto: UpdateCampaignDetailDto,
    ) {
        return this.campaignsService.updateCampaignDetail(id, updateCampaignDetailDto);
    }
    // Eliminar un detalle de campaña
    @Delete('details/:id')
    removeCampaignDetail(@Param('id', ParseUUIDPipe) id: string) {
        return this.campaignsService.removeCampaignDetail(id);
    }
    // Endpoints para noticias de campañas
    // Crear noticia de campaña
    @Post('news')
    createCampaignNews(@Body(ValidationPipe) createCampaignNewsDto: CreateCampaignNewsDto) {
        return this.campaignsService.createCampaignNews(createCampaignNewsDto);
    }
    // Obtener todas las noticias de campañas
    @Get('news/all')
    findAllCampaignNews() {
        return this.campaignsService.findAllCampaignNews();
    }
    // Obtener noticias públicas de campañas
    @Get('news/public')
    findPublicCampaignNews() {
        return this.campaignsService.findPublicCampaignNews();
    }
    // Obtener una noticia de campaña por ID
    @Get('news/:id')
    findOneCampaignNews(@Param('id', ParseUUIDPipe) id: string) {
        return this.campaignsService.findOneCampaignNews(id);
    }
    // Actualizar una noticia de campaña
    @Patch('news/:id')
    updateCampaignNews(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) updateCampaignNewsDto: UpdateCampaignNewsDto,
    ) {
        return this.campaignsService.updateCampaignNews(id, updateCampaignNewsDto);
    }
    // Eliminar una noticia de campaña
    @Delete('news/:id')
    removeCampaignNews(@Param('id', ParseUUIDPipe) id: string) {
        return this.campaignsService.removeCampaignNews(id);
    }
    // Endpoints para detalles y noticias de campañas
    // Obtener noticias por campaña
    @Get(':id/news')
    findNewsByCampaign(@Param('id', ParseUUIDPipe) campaignId: string) {
        return this.campaignsService.findNewsByCampaign(campaignId);
    }
    // Obtener detalles de campaña por ID
    @Get(':id/details')
    findDetailsByCampaign(@Param('id', ParseUUIDPipe) campaignId: string) {
        return this.campaignsService.findDetailsByCampaign(campaignId);
    }
}
