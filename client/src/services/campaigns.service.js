// src/services/campaigns.service.js

import AxiosRequest from './AxiosRequest';
import { mapMethod } from '../utils/MapMethod';

// Recurso base para las campañas
const RESOURCE = 'campaigns';

/**
 * Obtiene todas las campañas.
 * GET /campaigns
 * @returns {Promise<Array<Object>>} Una promesa con la lista de campañas.
 */
export const getAllCampaigns = async () => {
    return AxiosRequest(`${RESOURCE}`, mapMethod('R'));
};

/**
 * Obtiene una campaña por su ID.
 * GET /campaigns/:id
 * @param {string} id - ID de la campaña.
 * @returns {Promise<Object>} Una promesa con los detalles de la campaña.
 */
export const getCampaignById = async (id) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Crea una nueva campaña.
 * POST /campaigns
 * @param {Object} payload - Datos de la nueva campaña (CreateCampaignDto).
 * @returns {Promise<Object>} Una promesa con la campaña creada.
 */
export const createCampaign = async (payload) => {
    return AxiosRequest(`${RESOURCE}`, mapMethod('C'), payload);
};

/**
 * Actualiza una campaña existente.
 * PATCH /campaigns/:id
 * @param {string} id - ID de la campaña a actualizar.
 * @param {Object} payload - Datos actualizados de la campaña (UpdateCampaignDto).
 * @returns {Promise<Object>} Una promesa con la campaña actualizada.
 */
export const updateCampaign = async (id, payload) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('P'), payload);
};

/**
 * Elimina una campaña por su ID.
 * DELETE /campaigns/:id
 * @param {string} id - ID de la campaña a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve si la eliminación es exitosa.
 */
export const removeCampaign = async (id) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('D'));
};

/**
 * Obtiene los detalles de una campaña por el ID de la campaña.
 * GET /campaigns/:id/details
 * @param {string} campaignId - ID de la campaña.
 * @returns {Promise<Object>} Una promesa con los detalles asociados a la campaña.
 */
export const getCampaignDetailsByCampaignId = async (campaignId) => {
    return AxiosRequest(`${RESOURCE}/${campaignId}/details`, mapMethod('R'));
};

/**
 * Obtiene las noticias de una campaña por el ID de la campaña.
 * GET /campaigns/:id/news
 * @param {string} campaignId - ID de la campaña.
 * @returns {Promise<Array<Object>>} Una promesa con la lista de noticias asociadas a la campaña.
 */
export const getCampaignNewsByCampaignId = async (campaignId) => {
    return AxiosRequest(`${RESOURCE}/${campaignId}/news`, mapMethod('R'));
};
