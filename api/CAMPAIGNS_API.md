# Campaigns API

API REST para gestión de campañas publicitarias desarrollada con NestJS y TypeORM.

## Estructura de Base de Datos

La API maneja tres entidades principales:

### Campaigns (Campañas)
- **id**: UUID (Primary Key)
- **name**: Nombre de la campaña (requerido)
- **description**: Descripción de la campaña
- **start_date**: Fecha de inicio
- **end_date**: Fecha de fin
- **budget**: Presupuesto de la campaña
- **created_at, updated_at, deleted_at**: Timestamps de auditoría

### Campaign Details (Detalles de Campaña)
- **id**: UUID (Primary Key)
- **campaign_id**: UUID (Foreign Key a campaigns)
- **description**: Descripción detallada (requerido)
- **extra_info**: Información adicional (requerido)
- **created_at, updated_at, deleted_at**: Timestamps de auditoría

### Campaign News (Noticias de Campaña)
- **id**: UUID (Primary Key)
- **campaign_id**: UUID (Foreign Key a campaigns)
- **title**: Título de la noticia (requerido)
- **subtitle**: Subtítulo
- **thumbnail**: URL de imagen miniatura
- **hero_image**: URL de imagen principal
- **tags**: Tags en formato JSON
- **is_public**: Booleano que indica si es pública
- **content**: Contenido de la noticia (requerido)
- **author**: Autor de la noticia
- **created_at, updated_at, deleted_at**: Timestamps de auditoría

## Configuración

1. Copiar `.env.example` a `.env`
2. Configurar las variables de base de datos:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=tu_usuario
   DATABASE_PASSWORD=tu_contraseña
   DATABASE_NAME=campaigns_db
   DATABASE_SYNCHRONIZE=false
   DATABASE_LOGGING=false
   ```

3. Crear la base de datos PostgreSQL y ejecutar las queries del archivo `database/query.sql`

## Endpoints de la API

### Campaigns

#### GET /campaigns
Obtener todas las campañas
```bash
curl -X GET http://localhost:3000/campaigns
```

#### GET /campaigns/:id
Obtener una campaña específica
```bash
curl -X GET http://localhost:3000/campaigns/{campaign-id}
```

#### POST /campaigns
Crear una nueva campaña
```bash
curl -X POST http://localhost:3000/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Campaña Verano 2025",
    "description": "Campaña publicitaria para la temporada de verano",
    "start_date": "2025-06-01",
    "end_date": "2025-08-31",
    "budget": 50000.00
  }'
```

#### PATCH /campaigns/:id
Actualizar una campaña
```bash
curl -X PATCH http://localhost:3000/campaigns/{campaign-id} \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 60000.00
  }'
```

#### DELETE /campaigns/:id
Eliminar una campaña (soft delete)
```bash
curl -X DELETE http://localhost:3000/campaigns/{campaign-id}
```

### Campaign Details

#### GET /campaigns/details
Obtener todos los detalles de campaña
```bash
curl -X GET http://localhost:3000/campaigns/details
```

#### POST /campaigns/details
Crear detalles de campaña
```bash
curl -X POST http://localhost:3000/campaigns/details \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": "{campaign-id}",
    "description": "Descripción detallada de la campaña",
    "extra_info": "Información adicional relevante"
  }'
```

#### GET /campaigns/:id/details
Obtener detalles de una campaña específica
```bash
curl -X GET http://localhost:3000/campaigns/{campaign-id}/details
```

### Campaign News

#### GET /campaigns/news
Obtener todas las noticias de campañas
```bash
curl -X GET http://localhost:3000/campaigns/news
```

#### GET /campaigns/news/public
Obtener solo las noticias públicas
```bash
curl -X GET http://localhost:3000/campaigns/news/public
```

#### POST /campaigns/news
Crear una noticia de campaña
```bash
curl -X POST http://localhost:3000/campaigns/news \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": "{campaign-id}",
    "title": "Nuevo producto lanzado",
    "subtitle": "Descubre las novedades",
    "content": "Contenido completo de la noticia...",
    "is_public": true,
    "author": "Marketing Team",
    "tags": {"category": "product", "priority": "high"}
  }'
```

#### GET /campaigns/:id/news
Obtener noticias de una campaña específica
```bash
curl -X GET http://localhost:3000/campaigns/{campaign-id}/news
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test
npm run test:watch
npm run test:e2e

# Linting y formato
npm run lint
npm run format
```

## Características

- ✅ **Validación automática** de DTOs con class-validator
- ✅ **Soft delete** para todas las entidades
- ✅ **Relaciones TypeORM** entre entidades
- ✅ **Manejo de errores** con excepciones apropiadas
- ✅ **CORS habilitado** para desarrollo
- ✅ **Variables de entorno** configurables
- ✅ **UUIDs** como claves primarias
- ✅ **Timestamps automáticos** de auditoría
- ✅ **Queries optimizadas** con relaciones incluidas
- ✅ **Endpoints adicionales** para consultas específicas

## Arquitectura

La aplicación sigue la arquitectura estándar de NestJS:

```
src/
├── campaigns/
│   ├── dto/                 # Data Transfer Objects
│   ├── entities/           # Entidades TypeORM
│   ├── campaigns.controller.ts
│   ├── campaigns.service.ts
│   └── campaigns.module.ts
├── app.module.ts           # Módulo principal
└── main.ts                # Punto de entrada
```

## Próximos Pasos

1. Configurar la base de datos PostgreSQL
2. Ejecutar las migraciones
3. Configurar el archivo `.env`
4. Ejecutar `npm run start:dev`
5. Probar los endpoints con las URLs de ejemplo
