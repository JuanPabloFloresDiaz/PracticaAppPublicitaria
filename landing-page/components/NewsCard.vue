<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
    <!-- News Image -->
    <div class="relative h-48 overflow-hidden">
      <!-- Usar thumbnail si existe, sino extraer del contenido -->
      <div v-if="newsImage" class="absolute inset-0">
        <img 
          :src="newsImage"
          :alt="news.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          @error="handleImageError"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      <div 
        v-else 
        class="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon name="heroicons:newspaper" class="w-16 h-16 text-white opacity-50" />
        </div>
      </div>
      
      <!-- Date Badge -->
      <div class="absolute top-4 left-4">
        <span class="bg-white/95 text-purple-800 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {{ formatDate(news.published_at || news.created_at) }}
        </span>
      </div>
      
      <!-- Category Badge -->
      <div v-if="news.category" class="absolute top-4 right-4">
        <span class="bg-purple-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {{ news.category }}
        </span>
      </div>
    </div>
    
    <!-- News Content -->
    <div class="p-6">
      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors duration-200">
        {{ news.title }}
      </h3>
      
      <!-- Subtitle if exists -->
      <p v-if="news.subtitle" class="text-purple-600 font-medium mb-2 line-clamp-1">
        {{ news.subtitle }}
      </p>
      
      <!-- Description from HTML content -->
      <div class="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed" v-html="displayedContentText">
      </div>
      
      <!-- Author and Read Time -->
      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div class="flex items-center">
          <Icon name="heroicons:user-circle" class="w-4 h-4 mr-1" />
          <span>{{ news.author || 'Publicate' }}</span>
        </div>
        <div class="flex items-center">
          <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
          <span>{{ readTime }} min</span>
        </div>
      </div>
      
      <!-- Tags -->
      <div v-if="newsTags && newsTags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tag in newsTags.slice(0, 3)" 
          :key="tag"
          class="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
        >
          #{{ tag }}
        </span>
        <span 
          v-if="newsTags.length > 3"
          class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
        >
          +{{ newsTags.length - 3 }}
        </span>
      </div>
      
      <!-- Action Button -->
      <button
        @click="$emit('read-more', news)"
        class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
      >
        Leer Más
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// Las funciones de utils/contentUtils.js se auto-importan en Nuxt 3,
// por lo que no es necesario importarlas explícitamente aquí.
// import { extractFirstImage, extractTextFromHtml } from '../utils/contentUtils' // ELIMINAR ESTA LÍNEA

const props = defineProps({
  news: {
    type: Object,
    required: true,
    validator: (news) => {
      return news && typeof news === 'object' && news.title
    }
  }
})

const emit = defineEmits(['read-more'])

// Computed properties
const newsImage = computed(() => {
  // Priorizar thumbnail, luego extraer del contenido (extractFirstImage se auto-importa)
  return props.news.thumbnail || extractFirstImage(props.news.content)
})

const newsTags = computed(() => {
  if (Array.isArray(props.news.tags)) {
    return props.news.tags
  }
  if (typeof props.news.tags === 'object' && props.news.tags !== null) {
    return Object.keys(props.news.tags)
  }
  return []
})

// CAMBIO: Nueva propiedad computada para el texto del contenido
const displayedContentText = computed(() => {
  // sanitizeHtmlContent se auto-importa desde utils/contentUtils.js
  // extractTextFromHtml se auto-importa desde utils/contentUtils.js
  const sanitized = sanitizeHtmlContent(props.news.content);
  return extractTextFromHtml(sanitized, 150); // Puedes ajustar maxLength si es necesario
});


const readTime = computed(() => {
  // extractTextFromHtml se auto-importa
  const content = extractTextFromHtml(props.news.content)
  const wordsPerMinute = 200
  const wordCount = content.split(' ').length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
})

// Methods
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const formatDate = (date) => {
  if (!date) return 'Fecha no disponible'
  
  try {
    const dateObj = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now - dateObj)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return 'Hace 1 día'
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`
    } else {
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(dateObj)
    }
  } catch (error) {
    return 'Fecha inválida'
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
