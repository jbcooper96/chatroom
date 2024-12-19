const mongoose = require('mongoose')
const Account = require('./Account')
const bcrypt = require('bcrypt')
const {DEV_PASSWORD} = require('../constants')

const postSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "Account"
        },
        parent: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
            default: null
        },
        root: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
            default: null
        },
        depth: {
            type: Number,
            default: 0
        },
        descendents: {
            type: Number,
            default: 0
        },
        childrenCount: {
            type: Number,
            default: 0
        },
        removed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

async function getPassword() {
    let password = DEV_PASSWORD;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

postSchema.pre("save", async function () {
    if (!this.user) {
        let acc = await Account.findOne({ username: this.username });
        if (!acc) {
            const password = await getPassword();
            acc = new Account({
                username: this.username,
                password: password
            });
            acc = await acc.save();
            this.user = acc._id;
        }
        else {
            this.user = acc._id;
        }
    }
    if (this.root && this.isNew) {
        if (this.isNew) {
            const Post = this.constructor;
            const root = await Post.findOne({ _id: this.root });
            root.descendents += 1;
            if (this.root == this.parent) {
                root.childrenCount += 1;
            }
            await root.save();
        }
        else if (this.removed === true) {
            const Post = this.constructor;
            const root = await Post.findOne({ _id: this.root });
            root.descendents -= 1;
            if (this.root == this.parent) {
                root.childrenCount -= 1;
            }
            await root.save();
        }
    }
    if (this.parent && this.root != this.parent) {
        if (this.isNew) {
            const Post = this.constructor;
            const parent = await Post.findOne({ _id: this.parent });
            parent.childrenCount += 1;
            await parent.save();
        }
        else if (this.removed === true) {
            const Post = this.constructor;
            const parent = await Post.findOne({ _id: this.parent });
            parent.childrenCount -= 1;
            await parent.save();
        }
    }

    return;
});

postSchema.pre("deleteOne", async function () {
    if (this.root && this.removed === true) {
        const Post = this.constructor;
        const root = await Post.findOne({ _id: this.root });
        root.descendents -= 1;
        if (this.root == this.parent) {
            root.childrenCount -= 1;
        }
        await root.save();
    }
    if (this.parent && this.removed === true && this.root != this.parent) {
        const Post = this.constructor;
        const parent = await Post.findOne({ _id: this.parent });
        parent.childrenCount -= 1;
        await parent.save();
    }
    return;
});

const modelName = 'Post'

module.exports = mongoose.model(modelName, postSchema)