const express = require('express') // Backend App (server)
const cors = require('cors') // HTTP headers (enable requests)
const cookieParser = require('cookie-parser');
const {ORIGIN} = require('../constants')

// initialize app
const app = express()

// middlewares
app.use(cors({origin: ORIGIN, credentials: true}))
app.use(express.json({extended: true})) // body parser
app.use(express.urlencoded({extended: false})) // url parser
app.use(cookieParser());

// error handling
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send()
  next()
})

module.exports = app
