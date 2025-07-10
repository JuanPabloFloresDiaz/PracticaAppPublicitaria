// services/campaign_details.service.js
import { useApiFetcher } from '../composables/useApiFetcher';
import { mapMethod } from '../utils/MapMethod';

// Recurso base para los detalles de campaña
const RESOURCE = 'campaigns/details';

/**
 * Obtiene un detalle de campaña por su ID.
 * GET /campaigns/details/:id
 * @param {string} id - ID del detalle de campaña.
 * @returns {object} Un objeto con data, pending, error y execute de useFetch.
 */
export const getCampaignDetailById = (id) => {
    return useApiFetcher(`${RESOURCE}/${id}`, mapMethod('R'));
};
