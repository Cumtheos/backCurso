const { response, request } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')



const crearUsuario = async (req = request, res = response) => {
    const { email, name, password } = req.body;

    try {
        //verificar el email sea unico
        const usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario ya existe con ese email'
            });
        }
        //crear usuario con el modelo: se pueden enviar mas info pero con el modelo solo usara esos
        const dbUser = new Usuario(req.body);
        //Hashear la contraseña
        //numeros aleatorios 
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);


        //generar el JWT

        const token = await generarJWT(dbUser.id, name);

        //Crear usuario de BD

        await dbUser.save();

        //Generar Respuesta Exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }




}

const loginUsuario = async (req, res = response) => {


    const { email, password } = req.body;

    //solo un return ya que si no daria error
    try {

        const dbUser = await Usuario.findOne({ email });
        if (!dbUser) {
            //400 es badrequest
            return res.status(400).json({
                ok: false,
                //solo para fines educativos ya que si no deberia decir que uno o otro: se pondria credenciales no validas
                msg: 'El correo es incorrecto'
            });
        }

        //Confirmar si el password hace match
        //sirve para comparar un march con otra contraseña encriptada
        const validPassword = bcrypt.compareSync(password, dbUser.password);
        //como es syncrono dara un bool


        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                //solo para fines educativos ya que si no deberia decir que uno o otro: se pondria credenciales no validas
                msg: 'El password es incorrecto'
            });
        }
        //generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        //respuesta del Servicio
        //no es necesario ponerlo ya que es el ultimo paso
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        });

    } catch (error) {
        console.log(error);
        //como se valida antes se pone 500
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });

    }


};

const revalidarToken = async (req = request, res = response) => {

    const { uid, name } = req;
    //genera jwt y asi generar otro y validar
    const token = await generarJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        name,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}