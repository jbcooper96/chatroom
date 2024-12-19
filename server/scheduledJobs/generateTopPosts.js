const GptDataGenerator = require('../utils/gptDataGenerator')
const {GENERATION_WINDOW, MIN_POSTS, DEV_PASSWORD} = require('../constants')
const Post = require('../models/Post')
const Account = require('../models/Account')
const bcrypt = require('bcrypt')

async function getPassword() {
    let password = DEV_PASSWORD;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function mapGptToPost(gptPosts) {
    let posts = [];
    let usernames = []
    const usernamesToIds = new Map();

    console.log(gptPosts)
    for (let gptPost of gptPosts) {
        posts.push(new Post({
            text: gptPost.text,
            username: gptPost.username
        }));
        usernames.push(gptPost.username);
    }

    const accounts = await Account.find({username: { $in: usernames }});
    for (let account of accounts) {
        usernamesToIds.set(account.username, account._id);
    }
    let newAccounts = [];
    for (let username of usernames) {
        if (!usernamesToIds.has(username)) {
            newAccounts.push(new Account({
                username: username,
                password: await getPassword()
            }));
        }
    }
    newAccounts = await Account.insertMany(newAccounts);

    for (let newAccount of newAccounts) {
        usernamesToIds.set(newAccount.username, newAccount._id);
    }

    for (let post of posts) {
        post.user = usernamesToIds.get(post.username);
    }
    return posts;
}

async function generateTopPosts() {
    const dataGenerator = new GptDataGenerator();
    let newMessages = await dataGenerator.getParentMessages();
    let posts = await mapGptToPost(newMessages.messages);
    await Post.insertMany(posts);
}

module.exports = generateTopPosts;