// services/campaigns.service.js
import { useApiFetcher } from '../composables/useApiFetcher';
import { mapMethod } from '../utils/MapMethod';

// Recurso base para las campañas
const RESOURCE = 'campaigns';

/**
 * Obtiene todas las campañas.
 * GET /campaigns
 * @returns {object} Un objeto con data, pending, error y execute de useFetch.
 */
export const getAllCampaigns = () => {
    return useApiFetcher(RESOURCE, mapMethod('R'));
};

/**
 * Obtiene una campaña por su ID.
 * GET /campaigns/:id
 * @param {string} id - ID de la campaña.
 * @returns {object} Un objeto con data, pending, error y execute de useFetch.
 */
export const getCampaignById = (id) => {
    return useApiFetcher(`${RESOURCE}/${id}`, mapMethod('R'));
};

/**
 * Obtiene los detalles de una campaña por el ID de la campaña.
 * GET /campaigns/:id/details
 * @param {string} campaignId - ID de la campaña.
 * @returns {object} Un objeto con data, pending, error y execute de useFetch.
 */
export const getCampaignDetailsByCampaignId = (campaignId) => {
    return useApiFetcher(`${RESOURCE}/${campaignId}/details`, mapMethod('R'));
};

/**
 * Obtiene las noticias de una campaña por el ID de la campaña.
 * GET /campaigns/:id/news
 * @param {string} campaignId - ID de la campaña.
 * @returns {object} Un objeto con data, pending, error y execute de useFetch.
 */
export const getCampaignNewsByCampaignId = (campaignId) => {
    return useApiFetcher(`${RESOURCE}/${campaignId}/news`, mapMethod('R'));
};
