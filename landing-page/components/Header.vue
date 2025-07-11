<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="headerClasses">
    <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/98 to-white/95 backdrop-blur-md"></div>
    <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
    
    <nav class="relative container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo mejorado -->
        <div class="flex items-center space-x-3 group">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div class="relative bg-gradient-to-br from-purple-50 to-purple-100 p-2 rounded-xl border border-purple-200/50 group-hover:border-purple-300/70 transition-all duration-300">
              <img 
                src="~/assets/publicate.avif" 
                alt="Publicate Logo" 
                class="h-8 w-auto filter group-hover:brightness-110 transition-all duration-300"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-2xl font-bold bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Publicate
            </span>
            <span class="text-xs text-purple-600/70 font-medium tracking-wide">
              Marketing Digital
            </span>
          </div>
        </div>
        
        <!-- Desktop Navigation mejorada -->
        <ul class="hidden lg:flex items-center space-x-1">
          <li v-for="item in navigationItems" :key="item.id">
            <button 
              @click="scrollToSection(item.id)"
              class="relative px-4 py-2 text-gray-700 hover:text-purple-700 font-medium transition-all duration-300 rounded-lg group"
            >
              <span class="relative z-10">{{ item.label }}</span>
              <div class="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
              <div class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300 rounded-full"></div>
            </button>
          </li>
        </ul>
        
        <!-- Mobile menu button mejorado -->
        <button 
          @click="toggleMobileMenu"
          class="lg:hidden relative p-2 text-gray-700 hover:text-purple-700 focus:outline-none group"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <Icon 
            :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" 
            class="relative z-10 w-6 h-6 transition-transform duration-300"
            :class="mobileMenuOpen ? 'rotate-90' : 'rotate-0'"
          />
        </button>
      </div>
      
      <!-- Mobile Navigation mejorada -->
      <div 
        class="lg:hidden transition-all duration-500 ease-out overflow-hidden"
        :class="mobileMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'"
      >
        <div class="bg-gradient-to-br from-white via-purple-50/30 to-white rounded-2xl shadow-xl border border-purple-100/50 backdrop-blur-sm">
          <ul class="p-2 space-y-1">
            <li v-for="item in navigationItems" :key="item.id">
              <button 
                @click="navigateToSection(item.id)"
                class="block w-full text-left py-3 px-4 text-gray-700 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 rounded-xl transition-all duration-300 font-medium group"
              >
                <span class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></div>
                  <span>{{ item.label }}</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false);

const navigationItems = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'oferta', label: 'Oferta' },
  { id: 'campanas', label: 'Campañas' },
  { id: 'noticias', label: 'Noticias' },
  { id: 'alianzas', label: 'Alianzas' },
  { id: 'apoyanos', label: 'Apóyanos' },
  { id: 'contacto', label: 'Contacto' }
];

const headerClasses = computed(() => {
  return [
    'shadow-lg shadow-purple-100/20',
    mobileMenuOpen.value ? 'shadow-xl shadow-purple-200/30' : ''
  ];
});

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const navigateToSection = (sectionId) => {
  scrollToSection(sectionId);
  mobileMenuOpen.value = false;
};

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest('header') && mobileMenuOpen.value) {
      mobileMenuOpen.value = false;
    }
  };
  
  document.addEventListener('click', handleClickOutside);
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>

<style scoped>
/* Mejoras en las transiciones */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efecto hover mejorado */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Gradientes personalizados */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Animación del logo */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.1);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(147, 51, 234, 0);
  }
}

.group:hover .relative > .relative {
  animation: pulse-glow 2s infinite;
}

/* Mejoras en el backdrop blur */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Transiciones suaves para el menú móvil */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos de hover más suaves */
@media (hover: hover) {
  .group:hover .transform {
    transform: scale(1.02);
  }
}

/* Responsive improvements */
@media (max-width: 1024px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 640px) {
  .container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>