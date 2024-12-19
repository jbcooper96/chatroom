const express = require('express')
const topPosts = require('../controllers/posts/topPosts')
const postReplies = require('../controllers/posts/postReplies')
const getChildren = require('../controllers/posts/getChildren')
const createPost = require('../controllers/posts/createPost')
const deletePost = require('../controllers/posts/deletePost')
const { authorizeBearerToken } = require('../middlewares/jsonwebtoken')

const router = express.Router()

router.post('/topposts', [], topPosts)

router.post('/postreplies', [], postReplies)

router.post('/getchildren', [], getChildren)

router.post('/createpost', [authorizeBearerToken], createPost)

router.post('/deletepost', [authorizeBearerToken], deletePost)

module.exports = router
