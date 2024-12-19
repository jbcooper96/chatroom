const Post = require('../../models/Post')
const Account = require('../../models/Account')
const map = require('./mapPost')

async function createPost(request, response, next) {
    try {
        const { parentId, text } = request.body;
        const { uid } = request.auth;
    
        const acc = await Account.findById(uid);
        const parent = await Post.findById(parentId);


        let post = new Post({
            text: text,
            username: acc.username,
            user: acc._id,
            parent: parent ? parent._id : null,
            root: parent ? parent.root : null,
            depth: parent ? parent.depth + 1 : 0
        });

        post = await post.save();

        response.status(200).json({
            message: 'Succesfully created post',
            data: map(post)
        });
    }
    catch (error) {
        console.error(error)
        response.status(500).send()
      }
   

}

module.exports = createPost;