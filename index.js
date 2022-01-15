const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();


//Crear el servidor/aplicacion de express
const app = express();

//coneccion a la BD
dbConnection();

//DIRECTORIO PUBLICO
app.use(express.static('public'))

//CORS -> ES UN middleware
app.use(cors());

//lectura y parseo del body -> es un middleware
app.use(express.json());

//RUTAS
//nombre del middleware
app.use('/api/auth', require('./routes/auth'));


//escucha para que corra en cierto puerto
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});