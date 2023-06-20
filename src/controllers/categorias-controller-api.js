//Requerimos la conexión a la base de datos
const { request } = require('express');
const { miConexion } = require('../database/db');

//Objeto para manejar el CRUD de categorias
const categoriasAPI = {};

//El objeto categoriasAPI = C, R (Una o Todas), U, D
//C = POST
//R = Get
//U = Put
//D = Delete
//Aqui vamos a eliminar una categporia
categoriasAPI.deleteCategoriaById = async (req=request,res,next)=>{
    try{
        const { id } = req.params;
        const conexion = await miConexion();
        const resultado = await conexion.query('DELETE FROM categoria WHERE id = ?',[id]);
        if(resultado[0].affectedRows>0){
            res.status(200).json({
                estado: 1,
                mensaje: "Categoria eliminada"
            });
        }else{
            res.status(404).json({
                estado: 0,
                mensaje: "Categoria no encontrada"
            });
        }
    }catch(error) {
        next(error);
    }
}
//Vamos a actualizar una categoria
categoriasAPI.updateCategoria = async (req=request,res=request,next) =>{
    try {
        const { descripcion,observaciones} = req.body;
        const { id } = req.params;
        if(id==undefined || descripcion==undefined || observaciones == undefined){
            res.status(400).json({
                estado: 0,
                mensaje: "Solicitud incorrecta: Faltan parametros"
            });
        }else{
            const conexion = await miConexion();
            const resultado = await conexion.query('UPDATE categoria SET descripcion = ?, observaciones = ? WHERE id = ?',[descripcion,observaciones,id]);
            if(resultado[0].affectedRows>0){
                res.status(200).json({
                    estado: 1,
                    mensaje: "Categoria actualizada",
                    descripcion: descripcion,
                    observaciones: observaciones
                });
            }else{
                res.status(404).json({
                    estado: 0,
                    mensaje: "Categoria no actualizada"
                });
            }
        }
    } catch (error) {
        next(error);
    }
}


//Vamos a agregar una categoria
categoriasAPI.agregarCategoria = async(req=request,res=request,next) =>{
    try {
        const { descripcion, observaciones } = req.body;
        //Verificar que la solicitud se realice correctamente
        //Que nos mande los dos campos
        if( descripcion == undefined || observaciones == undefined){
            res.status(400).json({
                estado: 0,
                mensaje: "Solicitud incorrecta: Faltan parametros"
            })
        }else{
            const conexion = await miConexion();
            const resultado = await conexion.query('INSERT INTO categoria(descripcion,observaciones) values(?,?)',[descripcion,observaciones]);
            if(resultado[0].affectedRows>0){
                res.status(201).json({
                    estado: 1,
                    mensaje: "Categoria creada",
                    categoria:{
                        id              : resultado[0].insertId,
                        descripcion     : descripcion,
                        observaciones   : observaciones
                    }
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

//Aqui que nos regrese una categorias por su ID
categoriasAPI.getCategoriaById = async(req=request,res,next) =>{
    try{
        //Recuperar el id de la categoría
        const { id } = req.params;
        const conexion = await miConexion();
        const [rows] = await conexion.query('SELECT * FROM categoria WHERE id = ?',[id]);
        if(rows.length > 0){
            res.status(200).json({
                estado:1,
                mensaje: "Categoria encontrada",
                categoria: rows[0]
            });
        }else{
            res.status(404).json({
                estado: 0,
                mensaje: "Categoria no encontrada",
                categoria: []
            });
        }
    }catch(error){
        next(error);
    }
}
//Aqui es para regresar Todas las categorias
categoriasAPI.getTodasCategorias = async (req,res, next)=>{
    try{
        const conexion = await miConexion();
        const [rows] = await conexion.query('SELECT * FROM categoria');
        if(rows.length==0){
            res.status(404).json({
                estado:0,
                mensaje: "Registros no encontrados",
                categorias: rows
            });
        }else{
            res.status(200).json({
                estado: 1,
                mensaje: "Registros encontrados",
                categorias: rows
            })
        }
    }catch(error){
        next(error);
    }
}

//Exportar para poder usarlo en otro modulo
module.exports = categoriasAPI;
