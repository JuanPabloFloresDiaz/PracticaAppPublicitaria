// src/services/campaign_news.service.js

import AxiosRequest from './AxiosRequest';
import { mapMethod } from '../utils/MapMethod';

// Recurso base para las noticias de campaña
const RESOURCE = 'campaigns/news';

/**
 * Obtiene todas las noticias de campañas.
 * GET /campaigns/news
 * @returns {Promise<Array<Object>>} Una promesa con la lista de noticias de campañas.
 */
export const getAllCampaignNews = async () => {
    return AxiosRequest(`${RESOURCE}`, mapMethod('R'));
};

/**
 * Obtiene todas las noticias públicas de campañas.
 * GET /campaigns/news/public
 * @returns {Promise<Array<Object>>} Una promesa con la lista de noticias públicas.
 */
export const getPublicCampaignNews = async () => {
    return AxiosRequest(`${RESOURCE}/public`, mapMethod('R'));
};

/**
 * Obtiene una noticia de campaña por su ID.
 * GET /campaigns/news/:id
 * @param {string} id - ID de la noticia de campaña.
 * @returns {Promise<Object>} Una promesa con los detalles de la noticia.
 */
export const getCampaignNewsById = async (id) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Crea una nueva noticia de campaña.
 * POST /campaigns/news
 * @param {Object} payload - Datos de la nueva noticia de campaña (CreateCampaignNewsDto).
 * @returns {Promise<Object>} Una promesa con la noticia creada.
 */
export const createCampaignNews = async (payload) => {
    return AxiosRequest(`${RESOURCE}`, mapMethod('C'), payload);
};

/**
 * Actualiza una noticia de campaña existente.
 * PATCH /campaigns/news/:id
 * @param {string} id - ID de la noticia de campaña a actualizar.
 * @param {Object} payload - Datos actualizados de la noticia de campaña (UpdateCampaignNewsDto).
 * @returns {Promise<Object>} Una promesa con la noticia actualizada.
 */
export const updateCampaignNews = async (id, payload) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('P'), payload);
};

/**
 * Elimina una noticia de campaña por su ID.
 * DELETE /campaigns/news/:id
 * @param {string} id - ID de la noticia de campaña a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve si la eliminación es exitosa.
 */
export const removeCampaignNews = async (id) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('D'));
};
