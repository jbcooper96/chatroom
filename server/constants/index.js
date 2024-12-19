require("dotenv").config()

const ORIGIN = 'http://localhost:3000'
const PORT = process.env.PORT || 8080

// for "atlas" edit MONGO_URI in -> .env file || for "community server" edit <MyDatabase>
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MyDatabase'
const MONGO_OPTIONS = {}

const JWT_SECRET = process.env.JWT_SECRET || 'unsafe_secret'

const OPEN_AI_KEY = process.env.OPEN_AI_KEY || 'NoKey'

const GENERATION_WINDOW = 5000 // time to wait before generating more top messages

const MIN_POSTS = 100 

const DEV_PASSWORD = process.env.DEV_PASSWORD;

module.exports = {
  ORIGIN,
  PORT,
  MONGO_URI,
  MONGO_OPTIONS,
  JWT_SECRET,
  OPEN_AI_KEY,
  GENERATION_WINDOW,
  MIN_POSTS,
  DEV_PASSWORD
}
