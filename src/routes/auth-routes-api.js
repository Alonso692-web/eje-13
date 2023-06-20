const express = require('express');
const authControllerApi = require('../controllers/auth-controller-api');
const router = express.Router();

router.post('/login',authControllerApi.login);
//router.delete('/logout',authControllerApi.logout);

module.exports = router;