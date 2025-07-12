# Landing Page Publicate

Landing page moderna y responsiva para la plataforma de publicidad digital Publicate, construida con Nuxt 3.

## 🚀 Características

- **Diseño Moderno**: Interface moderna con estética morada y diseño responsive
- **Navegación por Secciones**: Header con navegación suave a las diferentes secciones
- **Componentes Modulares**: Arquitectura de componentes reutilizables y mantenibles
- **Integración con API**: Consume datos de campañas y noticias mediante servicios
- **SEO Optimizado**: Meta tags, structured data y optimización para motores de búsqueda
- **Animaciones Suaves**: Transiciones y efectos de scroll animados
- **Responsive Design**: Optimizado para móviles, tablets y desktop

## 📁 Estructura de Componentes

```
components/
├── Header.vue                 # Navegación principal con logo
├── Footer.vue                # Footer con enlaces y redes sociales
├── NewsCard.vue              # Tarjeta reutilizable para noticias
└── sections/
    ├── HeroSection.vue       # Sección de inicio con texto animado
    ├── OfferSection.vue      # Servicios y oferta de valor
    ├── CampaignsSection.vue  # Carrusel de campañas
    ├── NewsSection.vue       # Grid de noticias
    ├── PartnersSection.vue   # Carrusel de alianzas
    ├── SupportSection.vue    # Sección de apoyo con newsletter
    └── ContactSection.vue    # Formulario de contacto
```

## 🛠️ Tecnologías Utilizadas

- **Nuxt 3**: Framework Vue.js con SSR/SSG
- **Vue 3**: Framework JavaScript reactivo
- **Tailwind CSS**: Framework de CSS utilitario
- **Nuxt UI**: Componentes UI con Tailwind
- **Nuxt Icon**: Iconos Heroicons
- **TypeScript**: Tipado estático

## 🎨 Secciones de la Landing

### 1. Header
- Logo de Publicate
- Navegación por anclas a secciones
- Menú móvil responsive
- Fixed header con efecto blur

### 2. Hero/Inicio
- Texto animado con efecto typewriter
- Imagen de fondo con overlay
- Botones de call-to-action
- Indicador de scroll

### 3. Oferta
- Grid de 3 servicios principales
- Iconos y descripciones
- Imágenes ilustrativas
- Lista de características

### 4. Campañas
- Carrusel responsive de campañas
- Consume API de campañas
- Botones para ver detalle y novedades
- Estados de carga y error

### 5. Noticias
- Grid 2x2 de noticias
- Componente NewsCard reutilizable
- Filtros por categoría
- Paginación con "Ver más"

### 6. Alianzas
- Carrusel de logos de partners
- Auto-play con controles manuales
- Efecto grayscale hover
- Grid de beneficios

### 7. Apóyanos
- Fondo degradado morado
- Estadísticas animadas
- Formulario de newsletter
- Opciones de apoyo

### 8. Contacto
- Formulario completo de contacto
- Información de contacto
- Enlaces a redes sociales
- Validación y estados de envío

### 9. Footer
- Información de la empresa
- Enlaces rápidos
- Datos de contacto
- Suscripción a newsletter
- Copyright y políticas

## 🚀 Instalación y Ejecución

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copia .env.example a .env y configura:
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

3. **Ejecutar en desarrollo:**
```bash
npm run dev
```

4. **Construir para producción:**
```bash
npm run build
```

5. **Previsualizar build:**
```bash
npm run preview
```

## 🔧 Servicios y API

La landing consume datos de:

- **Servicios de Campañas**: `~/services/campaigns.service.js`
- **Servicios de Noticias**: `~/services/campaigns_news.service.js`
- **Composable API**: `~/composables/useApiFetcher.js`

Los servicios están configurados para usar `useFetch` de Nuxt con manejo de errores y estados de carga.

## 🎯 Navegación

La navegación funciona mediante scroll suave a secciones con ID:
- `#inicio` - Hero Section
- `#oferta` - Offer Section  
- `#campanas` - Campaigns Section
- `#noticias` - News Section
- `#alianzas` - Partners Section
- `#apoyanos` - Support Section
- `#contacto` - Contact Section

## 📱 Responsive Design

La landing está optimizada para:
- **Mobile**: < 768px (diseño de columna única)
- **Tablet**: 768px - 1024px (diseño de 2 columnas)
- **Desktop**: > 1024px (diseño completo)

## 🎨 Tema y Colores

- **Primario**: Purple-600 (#9333ea)
- **Secundario**: Indigo-600 (#4f46e5)
- **Accent**: Purple-400 (#c084fc)
- **Fondo**: Gray-50/Gray-900
- **Texto**: Gray-800/White

## 🔍 SEO

Incluye:
- Meta tags optimizados
- Open Graph para redes sociales
- Structured data (JSON-LD)
- Sitemap automático
- URLs semánticas

## 🚀 Despliegue

La aplicación está lista para desplegar en:
- **Vercel** (recomendado para Nuxt)
- **Netlify**
- **Server Node.js**
- **Static hosting** (con `npm run generate`)

## 📞 Contacto

Para soporte o consultas sobre esta landing page:
- Email: info@publicate.com
- Teléfono: +34 91 123 45 67
