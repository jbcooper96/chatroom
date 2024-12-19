function map(post, showChildren=true) {
    return {
        id: post._id.toString(),
        text: post.text,
        username: post.username,
        parent: post.parent ? post.parent.toString() : null,
        children: [],
        depth: post.depth,
        childrenCount: post.childrenCount,
        showChildren: showChildren,
        liked: false
    }
}

module.exports = map;
