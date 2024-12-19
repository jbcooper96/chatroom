const Post = require('../../models/Post')
const Account = require('../../models/Account')
const map = require('./mapPost')

async function deletePost(request, response, next) {
    try {
        const { postId } = request.body;
        const { uid } = request.auth;
    
        const acc = await Account.findById(uid);
        const post = await Post.findById(postId);

        if (!post || post.user != uid) {
            return response.status(400).json({
                message: 'Not your post',
            });
        }

        const childrenCount = await Post.count({ parent: postId });
        if (childrenCount > 0) {
            post.text = "[removed]";
            post.removed = true;
            await post.save();
        }
        else {
            await post.deleteOne();
        }
        

        response.status(200).json({
            message: 'Succesfully deleted post'
        });
    }
    catch (error) {
        console.error(error)
        response.status(500).send()
      }
   

}

module.exports = deletePost;