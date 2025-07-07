// src/services/campaign_details.service.js

import AxiosRequest from './AxiosRequest';
import { mapMethod } from '../utils/MapMethod';

// Recurso base para los detalles de campaña
const RESOURCE = 'campaigns/details';

/**
 * Obtiene todos los detalles de campañas.
 * GET /campaigns/details
 * @returns {Promise<Array<Object>>} Una promesa con la lista de detalles de campañas.
 */
export const getAllCampaignDetails = async () => {
    return AxiosRequest(`${RESOURCE}`, mapMethod('R'));
};

/**
 * Obtiene un detalle de campaña por su ID.
 * GET /campaigns/details/:id
 * @param {string} id - ID del detalle de campaña.
 * @returns {Promise<Object>} Una promesa con los detalles de campaña.
 */
export const getCampaignDetailById = async (id) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Crea un nuevo detalle de campaña.
 * POST /campaigns/details
 * @param {Object} payload - Datos del nuevo detalle de campaña (CreateCampaignDetailDto).
 * @returns {Promise<Object>} Una promesa con el detalle de campaña creado.
 */
export const createCampaignDetail = async (payload) => {
    return AxiosRequest(`${RESOURCE}`, mapMethod('C'), payload);
};

/**
 * Actualiza un detalle de campaña existente.
 * PATCH /campaigns/details/:id
 * @param {string} id - ID del detalle de campaña a actualizar.
 * @param {Object} payload - Datos actualizados del detalle de campaña (UpdateCampaignDetailDto).
 * @returns {Promise<Object>} Una promesa con el detalle de campaña actualizado.
 */
export const updateCampaignDetail = async (id, payload) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('P'), payload);
};

/**
 * Elimina un detalle de campaña por su ID.
 * DELETE /campaigns/details/:id
 * @param {string} id - ID del detalle de campaña a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve si la eliminación es exitosa.
 */
export const removeCampaignDetail = async (id) => {
    return AxiosRequest(`${RESOURCE}/${id}`, mapMethod('D'));
};
