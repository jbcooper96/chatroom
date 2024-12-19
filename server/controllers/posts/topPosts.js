const Post = require('../../models/Post')
const map = require('./mapPost')

async function topPosts(request, response, next) {
    try {
        const {pageNumber} = request.body

        const posts = await Post.find({parent: null, removed: {$ne: true}}).sort({createdAt: "desc"}).skip(10*pageNumber).limit(10)
        
        response.status(200).json({
            message: 'Succesfully fetched messages',
            data: posts.map(map)
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).send();
      }
    

}

module.exports = topPosts