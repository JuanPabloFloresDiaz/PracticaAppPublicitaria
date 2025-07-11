import { useRuntimeConfig, useFetch } from '#app';
import { computed } from 'vue';

/**
 * Composable para realizar peticiones API usando useFetch de Nuxt.
 * Encapsula la URL base y el manejo de métodos.
 *
 * @param {string} resource El recurso de la API (ej. 'campaigns', 'campaigns/details').
 * @param {string} method El método HTTP (ej. 'GET', 'POST', 'PATCH', 'DELETE').
 * @param {object} [payload={}] El cuerpo de la petición para métodos POST/PUT/PATCH.
 * @param {object} [queryParams={}] Parámetros de consulta para la URL.
 * @returns {object} Un objeto con data, pending, error y la función execute.
 */
export function useApiFetcher(resource, method, payload = {}, queryParams = {}) {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const url = computed(() => {
    const params = new URLSearchParams(queryParams).toString();
    const fullUrl = `${apiBaseUrl}${resource}${params ? `?${params}` : ''}`;
    console.log(`[useApiFetcher] Construyendo URL: ${fullUrl}`);
    return fullUrl;
  });

  const fetchOptions = {
    method: method,
    body: ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) ? payload : undefined,
    immediate: true,
    watch: [url],
    onResponse({ request, response, options }) {
      console.log(`[useApiFetcher] Petición exitosa para: ${request.url}`);
      console.log('[useApiFetcher] Datos recibidos:', response._data);
    },
    onResponseError({ request, response, options }) {
      console.error(`[useApiFetcher] Error en la petición para: ${request.url}`);
      console.error('[useApiFetcher] Detalles del error:', response._data || response);
    },
    onRequest({ request, options }) {
      console.log(`[useApiFetcher] Iniciando petición: ${options.method} ${request.url}`);
      console.log('[useApiFetcher] Opciones de petición:', options);
    }
  };

  const { data, pending, error, refresh: execute } = useFetch(url, fetchOptions);

  return {
    data,
    pending,
    error,
    execute
  };
}
