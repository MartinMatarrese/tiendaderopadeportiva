# Api de Tienda de Ropa Deportiva

# Descripción
Este proyecto es un servidor de un e-commerce en donde se registran los usuarios con autenticación de email, se loguean y pueden agregar productos al carrito, ver los productos que agregaron, eliminarlos, crear una compra eligiendo el metodo de pago, pagarlo y te devuelve el ticket con los datos de la compra.

# Caractéristicas
- Crear productos, actualizar productos, eliminarlos.
- Ver el detalle de los productos.
- Crear un carrito de compras.
- Crear un usuario y registrarse.
- Crear un metodo de pago, pagar y eliminar el metodo de pago.
- Crear un ticket de compra.

# Tecnologías utilizadas
- Node js
- Express
- Mongo DB con Mongoosse
- JWT con autenticacón
- Passport js
- Google oauth20
- Faker.js para datos de prueba
- Socket.io para documentación de la API
- Jest y Supertest para tests
- Docker para contenerización

# Instalación
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

3. Crear un archivo .env con tus variables de entorno (como MONGO_URL, SECRET_KEY)

4. Ejecutar la aplicación

    ```bash
    npm start
    ```

## Imagen docker
Podés correr la imagen de este proyecto directamente desde docker hub:

[https://hub.docker.com/r/martin1694/api-tienda](https://hub.docker.com/r/martin1694/api-tienda)

Para ejecutarla:

```bash
docker run -d -p 8080:8080 martin1694/api-tienda:1.0.0
```

## Documentación de la API
Una vez que la API esté corriendo localmente o en un contenedor docker, podes acceder a la documentación completa generada con swagger en:

[http://localhost:8080/docs](http://localhost:8080/docs)

## Autor
Martin Matarrese