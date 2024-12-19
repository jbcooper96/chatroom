const Post = require('../../models/Post')
const map = require('./mapPost')

async function getChildren(request, response, next) {
    try {
        const { postId } = request.body;

        const children = await Post.find({ parent: postId, removed: {$ne: true} });

        response.status(200).json({
            message: 'Succesfully fetched replies',
            children: children.map(map)
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).send();
    }

}

module.exports = getChildren;