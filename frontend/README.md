# Tienda de Ropa Deportiva - Frontend

## Descripción
Frontend de la tienda de ropa deportiva desarrollado en React. Los usuarios pueden navegar por productos, gestionar un carrito de compras y completar órdenes mediante Mercado Pago.

## Características Implementadas 
- **Catálogo de productos** organizado por categorías (Camisetas, Camperas, Shorts, Botines).
- **Carrito de compras** persistente con gestión completa.
- **Autenticación de usuarios** integrada con Backend.
- **Pasarela de pago** con Mercado Pago.
- **Diseño responsive** y moderno.
- **Gestión de estado** con Context API.
- **Ruteo** con React Router DOM.

## Tecnologías Utilizadas
- **React** Biblioteca principal.
- **React Router DOM** - Navegación entre vistas.
- **Context API** - Gestión de estado global.
- **Axios** - Cliente HTTP para APIs.
- **SweetAlert2** - Notificaciones y alertas.
- **CSS Modules** - Estilos componentizados. 
- **Google Fonts** - Tipografía (Montserrat, Open Sans, Playfair Display)

## Instalación y Desarrollo

### Prerequisitos
- Node.js 16+
- Backend ejecutandose en `http://localhost:8080`

### Pasos para ejecutar

1. Clonar el repositorio:

    ```bash
    git clone https://martinmatarrese.github.com/tiendaderopadeportiva/
    ```

2. Instalar las dependencias:

    ```bash
    npm install
    ```

3. Ejecutar la aplicación:

    ```bash
    npm start
    ```

4. La aplicación estará disponible en http://localhost:3000

5. Scripts disponibles
- `npm start` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run deploy` - Deploy a Github Pages

## Integración con Backend
El frontend se comunica con el backend a través de
- **Autenticación**: JWT Tokens
- **API REST**: Endpoints para productos usuarios y ordenes
- **WebSocket** - Notificaciones en tiempo real

## Fonts Usadas
Se han utilizado las siguientes fuentes de Google Fonts:

- Montserrat Alternates
- Open Sans
- Playfair Display

Incluir el siguiente enlace en tu archivo HTML para agregar estas fuentes:

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">

## Deployment
- Producción: Github Pages
- URL: https://martinmatarrese.github.io/tiendaderopadeportiva

## Estructura de componentes
src/
├── components/     # Componentes reutilizables
├── image/          # Imagenes utilizadas en el proyecto
├── pages/          # Página de error
├── App.js/         # Estructura de la aplicación
├── index.js/       # Donde corre la aplicación
└── App.css/         # Archivo CSS general

## Autor
Martin Matarrese