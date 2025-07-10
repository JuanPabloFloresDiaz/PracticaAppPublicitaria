// services/campaigns_news.service.js
import { useApiFetcher } from '../composables/useApiFetcher';
import { mapMethod } from '../utils/MapMethod';

// Recurso base para las noticias de campaña
const RESOURCE = 'campaigns/news';

/**
 * Obtiene todas las noticias públicas de campañas.
 * GET /campaigns/news/public
 * @returns {object} Un objeto con data, pending, error y execute de useFetch.
 */
export const getPublicCampaignNews = () => {
    return useApiFetcher(`${RESOURCE}/public`, mapMethod('R'));
};

/**
 * Obtiene una noticia de campaña por su ID.
 * GET /campaigns/news/:id
 * @param {string} id - ID de la noticia de campaña.
 * @returns {object} Un objeto con data, pending, error y execute de useFetch.
 */
export const getCampaignNewsById = (id) => {
    return useApiFetcher(`${RESOURCE}/${id}`, mapMethod('R'));
};

