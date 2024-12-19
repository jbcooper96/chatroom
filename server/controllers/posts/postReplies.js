const Post = require('../../models/Post')
const generateCommentTree = require('../../utils/commentTreeGenerator')
const map = require('./mapPost')

async function generateReplies(post) {
    const childrenCount = await Post.countDocuments({parent: post._id});
    if (childrenCount == 0 && post.parent == null) {
        await generateCommentTree(post);
    }
}


async function postReplies(request, response, next) {
    try {
        const {postId} = request.body;
        const maxDepth = 2;

        const post = await Post.findById(postId);
        if (!post) {
            response.status(500).send();
        }
    
        await generateReplies(post);

        const parentPostResponse = map(post);

        let lastLayerChildren = new Map();
        lastLayerChildren.set(parentPostResponse.id, parentPostResponse);

        let depth = 1
        while (depth <= maxDepth) {
            const layerPosts = await Post.find({root: postId, depth: depth, removed: {$ne: true}});
            if (!layerPosts || layerPosts.length == 0) {
                break;
            }
                
            const lastLayerChildrenTmp = new Map();
            for (let layerPost of layerPosts) {
                if (lastLayerChildren.has(layerPost.parent.toString())){
                    const layerPostMapped = map(layerPost, depth != maxDepth);
                    lastLayerChildren.get(layerPostMapped.parent).children.push(layerPostMapped)
                    lastLayerChildrenTmp.set(layerPostMapped.id, layerPostMapped);
                }
            }
            lastLayerChildren = lastLayerChildrenTmp;
            depth +=1;
        }

        response.status(200).json({
            message: 'Succesfully fetched replies',
            data: parentPostResponse
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).send();
    }
}

module.exports = postReplies;