/*
    path: api/usuarios
*/
const { Router } = require('express');
const { getUsuarios } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();


//Validar JWT
router.get('/', validarJWT, getUsuarios);

module.exports = router;