const { request } = require('express');
const { miConexion } = require('../database/db');
const brcypt = require('bcrypt');

const usuariosAPI = {};

//CRUD
usuariosAPI.agregarUsuario = async(req=request,res,next)=>{
    try {
        const { usuario,clave,nombre } = req.body;
        if (usuario==undefined || clave==undefined || nombre==undefined) {
            res.status(400).json({
                estado: 0,
                mensaje: "Solicitud incorrecta, faltan parámetros"
            });
        } else {
            const claveEncriptada = await brcypt.hash(clave,10);
            const conexion = await miConexion();
            const resultado = await conexion.query('INSERT INTO usuarios (usuario,clave,nombre) VALUES (?,?,?)',[usuario,claveEncriptada,nombre]);
            if (resultado[0].affectedRows>0) {
                res.status(201).json({
                    estado: 1,
                    mensaje: "Usuario registrado con éxito",
                    usuario: {
                        id: resultado[0].insertId,
                        usuario: usuario,
                        nombre: nombre,
                        clave: claveEncriptada
                    }
                });
            }else{
                res.status(500).json({
                    estado: 0,
                    mensaje:"Error interno del servidor"
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

module.exports = usuariosAPI;