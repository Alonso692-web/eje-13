const express = require('express');
const usuariosControllerApi = require('../controllers/usuarios-controllers-api');
const router = express.Router();

router.post('/',usuariosControllerApi.agregarUsuario);

module.exports = router;