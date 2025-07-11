// utils/contentUtils.js
// Este archivo contendrá funciones utilitarias que pueden ser auto-importadas por Nuxt.

/**
 * Función para extraer la primera imagen del contenido HTML.
 * @param {string} htmlContent - Contenido HTML.
 * @returns {string|null} La URL de la primera imagen encontrada o null.
 */
export const extractFirstImage = (htmlContent) => {
  if (!htmlContent) return null;
  
  // Usamos DOMParser solo en el cliente para evitar errores en SSR
  if (process.client) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const img = doc.querySelector('img');
    return img ? img.src : null;
  }
  return null; // Retornar null si estamos en el servidor
};

/**
 * Función para extraer texto plano del HTML.
 * @param {string} htmlContent - Contenido HTML.
 * @param {number} [maxLength=150] - Longitud máxima del texto a extraer.
 * @returns {string} El texto plano extraído.
 */
export const extractTextFromHtml = (htmlContent, maxLength = 150) => {
  if (!htmlContent) return '';
  
  // Usamos DOMParser solo en el cliente para evitar errores en SSR
  if (process.client) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const text = doc.body.textContent || doc.body.innerText || '';
    
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  }
  return ''; // Retornar cadena vacía si estamos en el servidor
};

/**
 * Función para limpiar y preparar contenido HTML para mostrar (remover scripts y elementos peligrosos).
 * @param {string} htmlContent - Contenido HTML.
 * @returns {string} El contenido HTML limpio.
 */
export const sanitizeHtmlContent = (htmlContent) => {
  if (!htmlContent) return '';
  
  // Esta función no usa DOMParser directamente, por lo que puede ejecutarse en ambos entornos.
  // Remover scripts y elementos peligrosos
  const cleanContent = htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/g, ''); // Remover atributos on* (onclick, onerror, etc.)
  
  return cleanContent;
};
