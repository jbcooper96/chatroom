require('dotenv').config() // Secures variables
const app = require('./utils/app') // Backend App (server)
const mongo = require('./utils/mongo') // MongoDB (database)
const { PORT } = require('./constants')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')
const cron = require("node-cron");
const generateTopPosts = require("./scheduledJobs/generateTopPosts")
const generateCommentTree = require('./utils/commentTreeGenerator')
const Post = require('./models/Post')

async function bootstrap() {
    await mongo.connect()

    app.get('/', (req, res) => res.status(200).json({ message: 'Hello World!' }))
    app.get('/healthz', (req, res) => res.status(200).send())
    app.use('/auth', authRoutes)
    app.use('/posts', postRoutes)

    app.listen(PORT, () => {
        console.log(`✅ Server is listening on port: ${PORT}`)
    })
    //await generateTopPosts();
    //cron.schedule("* */5 * * * *", generateTopPosts);
}

bootstrap()
