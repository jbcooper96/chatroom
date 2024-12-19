const express = require('express')
const { authorizeBearerToken } = require('../middlewares/jsonwebtoken')
const register = require('../controllers/auth/register')
const login = require('../controllers/auth/login')
const logout = require('../controllers/auth/logout')
const loginWithToken = require('../controllers/auth/login-with-token')

const router = express.Router()

router.post('/register', [], register)

router.post('/login', [], login)

router.get('/logout', [], logout)

router.get('/login', [authorizeBearerToken], loginWithToken)

module.exports = router
