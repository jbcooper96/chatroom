import Message from './Message'
import axios from '../utils/axios'
import { useState } from 'react'
import { useParams } from "react-router"



function traverseCommentTree(tree, id) {
    const traverse = (post) => {
        if (post.id === id) {
            return {
                found: true,
                post: post
            }
        }
        for (let child of post.children) {
            let res = traverse(child);
            if (res.found) {
                return res;
            }
        }
        return {
            found: false,
            post: null
        }
    }

    let res = traverse(tree);
    return res.post;
}

function Children({children, loadMore, replyDefault, removePost}) {
    return (
        <div style={{paddingLeft: "2em", borderLeftColor: "#bdbdbd", borderLeftWidth: ".75px", borderLeftStyle: "solid"}}>
            {children.map(child => {
                if (child.children && child.children.length > 0) {
                    return (
                        <div>
                            <Message removePost={removePost} replyDefault={replyDefault} message={child}/>
                            <Children removePost={removePost} replyDefault={replyDefault} loadMore={loadMore} children={child.children}/>
                        </div>
                    );
                }
                return (
                    <div>
                        <Message removePost={removePost} replyDefault={replyDefault} message={child}/>
                        {child.childrenCount > 0 && <button data-id={child.id} onClick={loadMore}>Load More</button>}
                    </div>
                );
            })}
        </div>
    );
}

export default function ParentMessages() {
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const params = useParams()

    const handleLoadMore = (event) => {
        const id = event.target.getAttribute('data-id');
        if (!loading && id) {
            setLoading(true);
            axios.post('posts/getchildren', { "postId": id}).then(res => {
                if (res && res.data && res.data.children) {
                    setMessage((message) => {
                        const newMessage = JSON.parse(JSON.stringify(message));
                        const post = traverseCommentTree(newMessage, id);
                        post.children = res.data.children;
                        return newMessage;
                    });
                    setLoading(false);
                }
            })
        }
    } 

    const addPost = (post) => {
        setMessage((message) => {
            const newMessage = JSON.parse(JSON.stringify(message));
            const parent = traverseCommentTree(newMessage, post.parent);
            parent.children.push(post);
            return newMessage;
        });
    }

    const removePost = (post) => {
        setMessage((message) => {
            const newMessage = JSON.parse(JSON.stringify(message));
            const parent = traverseCommentTree(newMessage, post.parent);
            parent.children = parent.children.filter(child => child.id != post.id);
            return newMessage;
        });
    }

    if (message == null && !loading) {
        setLoading(true);
        console.log(params.id);
        axios.post('posts/postreplies', { "postId": params.id }).then(res => {
            console.log(res);
            if (res && res.data && res.data.data) {
                setMessage(res.data.data);
                setLoading(false);
            }
        })
    }


    if (message) {
        return (
            <div>
                <Message removePost={removePost} replyDefault={addPost} message={message}/>
                {message.children && <Children removePost={removePost} replyDefault={addPost} children={message.children} loadMore={handleLoadMore}/>}
                
            </div>
        );
    }
    else {
        return (<div></div>)
    }
}