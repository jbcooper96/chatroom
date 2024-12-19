import { IconButton, Card, CardContent, CardActions, Typography, CardActionArea} from '@mui/material';
import { useNavigate } from "react-router";
import ReplyIcon from '@mui/icons-material/Reply';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useState } from 'react'
import MessageEditor from './MessageEditor';
import axios from '../utils/axios'
import {useAuth} from '../contexts/AuthContext'


export default function Message({ message, parentPage, replyDefault, removePost }) {
    const {account} = useAuth()
    const [liked, setLiked] = useState(message.liked);
    const [showReply, setShowReply] = useState(false);

    const navigate = useNavigate()

    const showDelete = account?.username === message.username

    const onClick = (e) => {
        if (parentPage) {
            navigate("/message/" + message.id);
        }
    }

    const favorite = (e) => {
        setLiked(!liked);
    }

    const reply = (e) => {
        if (parentPage) {
            navigate("/message/" + message.id);
        }
        else {
            setShowReply(!showReply);
        }
    }

    const deletePost = () => {
        axios.post('posts/deletepost', { "postId": message.id })
            .then((res) => {
                removePost(message)
            })
            .catch((e) => {
                console.log(e);
            });
        
    }

    const addReply = (text) => {
        axios.post('posts/createpost', { "parentId": message.id, "text": text })
            .then((res) => {
                if (res && res.data && res.data.data) {
                    setShowReply(false);
                    replyDefault(res.data.data);
                }
            })
            .catch((e) => {
                console.log(e);
            });
        
    }

    const cancelReply = (e) => {
        setShowReply(false);
    }

    return (
        <Card key={message.id} sx={{ width: "100%", maxWidth: "800px", marginTop: "10px", pading: "0px" }}>
            <CardActionArea onClick={onClick}>
                <CardContent sx={{ paddingBottom: "5px", marginBottom: "5px" }}>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>
                        {message.username}
                    </Typography>
                    <Typography>
                        {message.text}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ padding: "0px" }}>
                <IconButton onClick={favorite}>
                    {liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                </IconButton>
                <IconButton onClick={reply}>
                    <ReplyIcon />
                </IconButton>
                {showDelete && (<IconButton onClick={deletePost}>
                    <DeleteIcon />
                </IconButton>)}
            </CardActions>
            <MessageEditor submit={addReply} cancel={cancelReply} show={showReply} />
        </Card>
    );
}