# DavidPlaces

DavidPlace es un API desarrollado con NodeJS y Express Generator como framework, además de que cuenta con el uso de otras librerías
para complementar la funcionalidad de un directorio de locales o establecimientos, gestión de usuarios y asignación de locales favoritos

   - Autenticación con JWT
   - CORs Midddlewares
   - Base de datos no relacionales (MongoDB) con su ORM Mongoose
   - Handling de peticiones con AJAX
   - Gestión de Aplicaciones para clientes
   - Uploader de fotos con Cloudinary
   - etc

## Descripción del Uso

- levantar el servidor con el comando node app.js (o nodemon en caso de tenerlo instalado) -> http://localhost:3000/
- levantar el demonio mongod durante la ejecucion del API
- Usar Postman para hacer la gestión de las peticiones y poder operar sobre la base de datos en MongoDB

## Cloudinary

 - Colocar el api_key, cloud_name y el api_secret dentro del archivo /config/secrets.js

## URLs

```
app.use('/places', places);
app.use('/places', visitsPlaces);
app.use('/users', users);
app.use('/sessions', sessions);
app.use('/favorites', favorites);
app.use('/visits', visits);
app.use('/applications', applications);
```

## Créditos
- [David Lares](https://twitter.com/davidlares3)

## Licencia

[MIT](https://opensource.org/licenses/MIT)
