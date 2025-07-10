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
    return `${apiBaseUrl}/${resource}${params ? `?${params}` : ''}`;
  });

  const fetchOptions = {
    method: method,
    body: ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) ? payload : undefined,
    immediate: true,
    watch: [url],
  };

  const { data, pending, error, refresh: execute } = useFetch(url, fetchOptions);

  return {
    data,
    pending,
    error,
    execute
  };
}