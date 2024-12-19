const gptDataGenerator = require('./gptDataGenerator')
const Post = require('../models/Post')

async function insertChildren(parentId, children, depth, root) {
    for (let child of children) {
        let p = new Post({
            text: child.text,
            username: child.username,
            parent: parentId,
            depth: depth,
            root: root
        });
        p = await p.save();
        if (child.children && child.children.length > 0) {
            await insertChildren(p._id, child.children, depth+1, root);
        }
    }
}

async function generateCommentTree(post) {
    const dataGenerator = new gptDataGenerator();
    const res = await dataGenerator.getResponseMessagesAll(post);
    let messages = res.messages;
    console.log(messages)
    for (let message of messages) {
        let p = new Post({
            text: message.text,
            username: message.username,
            parent: post._id,
            depth: 1,
            root: post._id
        });
        p = await p.save();
        if (message.children && message.children.length > 0) {
            await insertChildren(p._id, message.children, 2, post._id)
        }
    }
}

module.exports = generateCommentTree;
