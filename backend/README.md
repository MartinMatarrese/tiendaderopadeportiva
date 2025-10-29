# Api de Tienda de Ropa Deportiva - Backend

# Descripción
Servidor backend para e-commerce de ropa deportiva desarrollado en Node.js. Maneja autenticación de usuarios, gestión de productos, carritos de compra, procesamiento de pagos y generación de tickets.

# Caractéristicas Principales
- **Gestión de usuarios** - Registro, autenticación JWT y OAuth con Google
- **Catálogo de productos** - CRUD completo con categorías
- **Carritos de compra** - Persistente y por usuario
- **Pasarela de pago** - Integración con Mercado Pago
- **Sistema de órdenes** - Generación de tickets y confirmación
- **Emails transaccionales** - Notificaciones de compra
- **Documentación API** - Swagger/OpenAPI integrado

# Tecnologías utilizadas
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB + Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación con tokens
- **Passport.js** - Estrategias de autenticación
- **Google OAuth 2.0** - Login con Google
- **Mercado Pago SDK** - Procesamiento de pagos
- **Nodemailer** - Envío de emails
- **Socket.io** - Comunicación en tiempo real
- **Jest y Supertest** - Testing
- **Docker** - Contenerización
- **Swagger/OpenAPI** - Documentación

# Instalación y Desarrollo
Para ejecutar el proyecto de manera local sigue estos pasos

1. clonar el repositorio:

    ```bash
    git clone https://github.com/MartinMatarrese/tiendaderopadeportiva
    cd tiendaderopadeportiva/backend
    ```

2. Instalar las dependencias

    ```bash
    npm install
    ```

3. **Configurar variables de entorno:**
    Crear un archivo .env con:
    ```env
    SECRET_KEY=tu_secretkey_secreta
    MONGO_URL="mongodb://127.0.0.1:27017/tienda_deportiva"
    MONGO_DOCKER="mongodb://mongo:27017/tienda_deportiva"
    NODE_ENV=development
    CLIENT_ID_GOOGLE=tu_google_client_id
    CLIENT_SECRET_GOOGLE=tu_google_secret
    PUBLIC_KEY_MP=tu_key_mp_secret
    ACCES_TOKEN_MP=tu_token_mp_secret
    EMAIL=tu_email
    PASSWORD=tu_password_google
    PORT_GMAIL=tu_port_google
    PERSISTENCE=tu_persistence
    GOOGLE_CALLBACK_URL="http://localhost:8080/users/googlecallback"
    PORT_MAILTRAP=tu_port_mailtrap
    HOST_MAILTRAP=tu_host_mailtrap
    USER_MAILTRAP=tu_user_mailtrap
    PASSWORD_MAILTRAP=651f1d3cea62a1
    FRONTEND_URL=tu_frontend_url
    FRONTEND_LOCAL="http://localhost:3000/"
    ```


4. Ejecutar la aplicación

    ```bash
    npm start
    ```

5. **La API estara disponible en:** `https://tiendaderopadeportiva-production.up.railway.app/`

### Scripts disponibles
- `npm start`- Servidor de producción
- `npm run test` - Ejecutar todos los test
- `npm run test:users` - Ejecutar test de usuarios
- `npm run test:products` - Ejecutar test de productos
- `npm run test:carts` - Ejecutar test del carrito
- `npm run test:payment` - Ejecutar test del método de pago

## Docker

### Imagen Docker
Podés ejecutar la imagen directamente desde docker hub:

[https://hub.docker.com/r/martin1694/api-tienda](https://hub.docker.com/r/martin1694/api-tienda)

Para ejecutarla:

```bash
docker run -d -p 8080:8080 martin1694/api-tienda:1.0.0
```
### Construir imagen localmente

    ```bash
    docker build -t api-tienda .
    docker run -p 8080:8080 api-tienda
    ```

## Documentación de la API
Una vez que la API esta ejecutandose accede a la api completa con Swagger en:

[https://tiendaderopadeportiva-production.up.railway.app/docs](https://tiendaderopadeportiva-production.up.railway.app/docs)

### La documentación incluye
- Endpoints disponibles
- Parámetros requeridos
- Ejemplos de request/responses
- Esquema de datos

### Endpoints Principales

#### Autenticación
- **POST /users/register** - Registro del usuario
- **POST /users/login** - Logueo tradicional
- **GET /users/verify-email/:token** - Verificar email
- **POST /users/resend-verificacion** - Reenviar email de verificación
- **GET /users/google** - Login con Google
- **GET /users/googlecallback** - El usuario retornar despúes de autenticarse
- **GET /users/current** - Usuario actual
- **POST /users/profile-pic** - El usuario puede subir su foto de perfil
- **POST /users/logout** - Cerrar sesión
- **POST /users/forgot-password** - Solicitar recuperar la contraseña
- **POST /users/reset-password** - El usuario actualiza la contraseña


#### Productos
- **GET /api/products** - Lista de productos
- **GET /api/products/category/:category** - Obtener los productos por categoría
- **GET /api/products/:pid** - Obtener producto por ID
- **POST /api/products** - Crear producto (Admin)
- **PUT /api/products/:pid** - Actualizar producto (Admin)
- **DELETE /api/products/:id** - Eliminar producto (Admin)

#### Carritos
- **POST /api/carts** - Crea carrito
- **GET /api/carts/:cid** - Obtener carrito por ID
- **PUT /api/carts/:cid** - Actualiza productos del carrito
- **DELETE /api/carts/:cid** - Elimina carrito
- **POST /api/carts/:cid/products/:pid** - Agrega producto al carrito
- **PUT /api/carts/:cid/products/:pid** - Actualiza cantidad de un producto en el carrito
- **POST /api/carts/:cid/purchase** - Finaliza compra del carrito
- **DELETE /api/carts/:cid/products/:pid** - Elimina un producto

#### Pagos
- **POST /api/payments/create-preference** - Crea preferencia de pago
- **GET /api/payments/success** - Callback éxito de pago
- **GET /api/payments** - Obtiene los pagos
- **GET /api/payments/:paymentid** - Obtiene el pago por ID
- **POST /api/payments** - Crea pago
- **PUT /api/payments/:paymentid** - cargar el pago por el ID
- **DELETE /api/payments/:paymentid** - Elimina el pago

## Deployment
- **Producción:** Railway
- **Base de datos:** MongoDB Atlas
- **URL de producción:** https:/tu_app_railway.app

## Autor
Martin Matarrese

## Licencia
ISC