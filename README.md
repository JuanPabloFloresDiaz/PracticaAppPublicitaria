# PracticaAppPublicitaria

Repositorio para la práctica de una aplicación de publicidad que consiste en la gestión de campañas y noticias asociadas.

---

## Descripción del proyecto

La aplicación permite crear y gestionar campañas publicitarias, así como generar noticias o actualizaciones asociadas a cada campaña. El flujo completo incluye:

1. **Frontend Administrativo**: Interfaz para crear, detallar y actualizar campañas y noticias.
2. **Frontend Público**: Landing page para mostrar las campañas activas y sus noticias.
3. **Backend (API)**: Servidor REST que expone los endpoints necesarios para la gestión de datos.
4. **Base de datos**: PostgreSQL con un esquema sencillo de 3 tablas.

---

## Arquitectura general

```plaintext
+---------------------+       +----------------------+       +--------------------+
| Frontend Administrativo |<--->|     API Backend      |<--->|   Base de Datos    |
|  (Vue 3 + Vuetify 3)   |       | (NestJS + TypeORM)   |       |    (PostgreSQL)    |
+---------------------+       +----------------------+       +--------------------+
          |
          v
+--------------------------+
|  Frontend Público (Astro) |
+--------------------------+
```

---

## Base de datos (PostgreSQL)

La base de datos está compuesta por tres tablas principales:

* **campaigns**: Información básica de cada campaña (UUID, nombre, descripción, fechas, presupuesto).
* **campaign\_details**: Detalles extra de la campaña (UUID, descripción extendida, `extra_info`).
* **campaign\_news**: Noticias asociadas a cada campaña (UUID, título, subtítulo, `thumbnail`, `hero_image`, `tags` en JSONB, estado público, contenido y autor).

Cada tabla incluye los campos `created_at`, `updated_at` y `deleted_at` para auditoría y borrado lógico.

---

## Backend (API)

* **Framework**: NestJS
* **ORM**: TypeORM
* **Lenguaje**: TypeScript
* **Responsabilidades**:

  * Exponer endpoints CRUD para campañas, detalles y noticias.
  * Validación y transformación de datos con *class-validator* y *class-transformer*.
  * Conexión a PostgreSQL.

---

## Frontend Administrativo

* **Framework**: Vue 3

* **UI**: Vuetify 3

* **Estado y datos**:

  * `@tanstack/vue-db`
  * `@tanstack/vue-form`
  * `@tanstack/vue-query`
  * `@tanstack/vue-table`
  * `@tanstack/vue-virtual`

* **Editor de texto**: CKEditor 5 para la creación de contenido rico en noticias y descripciones.- **Editor de texto**: CKEditor 5 para la creación de contenido rico en noticias y descripciones.

* **Validación**: Zod para esquemas y validación de formularios.

* **Otras tecnologías**: Axios para llamadas HTTP, Pinia para estado global.

---

## Frontend Público

* **Generador de sitios estáticos**: Astro
* **Objetivo**: Consumir la API y renderizar una landing page con las campañas activas y sus noticias.
* **Características**:

  * Listado de campañas con fechas y presupuesto.
  * Vista detallada con noticias filtradas por campaña.
  * SEO optimizado y generación estática para rendimiento.

---

## Tecnologías y herramientas

* **Base de datos**: PostgreSQL
* **Servidor**: NestJS, TypeORM, TypeScript
* **Frontend Admin**: Vue 3, Vuetify 3,

  * `@tanstack/vue-db`
  * `@tanstack/vue-form`
  * `@tanstack/vue-query`
  * `@tanstack/vue-table`
  * `@tanstack/vue-virtual`
  * CKEditor 5
  * Zod
* **Frontend Público**: Astro
* **Control de versiones**: Git + GitHub

---

## Instalación & arranque

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/JuanPabloFloresDiaz/PracticaAppPublicitaria.git
   ```
2. **Backend**:

   ```bash
   cd PracticaAppPublicitaria/api
   npm install
   # Configurar variables de entorno (.env)
   npm run start:dev
   ```
3. **Frontend Administrativo**:

   ```bash
   cd PracticaAppPublicitaria/client
   npm install
   npm run dev
   ```
4. **Frontend Público**:

   ```bash
   cd PracticaAppPublicitaria/landing-page
   npm install
   npm run dev
   ```

---

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor abre un *issue* o un *pull request* describiendo la propuesta.

---

## Licencia

Este proyecto es **solo para práctica** y no cuenta con licencia específica.
