const express = require('express')
const categoriasControllerApi = require('../controllers/categorias-controller-api')
const router = express.Router();

//La Ruta (End Point) GET de todas las categorias 
router.get('/',categoriasControllerApi.getTodasCategorias);

//La Ruta (End Point) GET de solo una categoria 
router.get('/:id',categoriasControllerApi.getCategoriaById);

//La Ruta (End point) AGREGAR = POST de una categoria
router.post('/',categoriasControllerApi.agregarCategoria);

//La Ruta (End point) UPDATE = PUT de una categoria
router.put('/:id',categoriasControllerApi.updateCategoria);

//La Ruta (End point) DELETE de una categoria
router.delete('/:id',categoriasControllerApi.deleteCategoriaById);

//Para poder usar el router en otro archivo .js o modulo
module.exports = router;