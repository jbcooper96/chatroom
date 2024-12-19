import Message from './Message'
import axios from '../utils/axios'
import { Dialog, DialogTitle, TextField, Button, CircularProgress } from '@mui/material'
import { useState } from 'react'

export default function ParentMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [needToFetchFirstPosts, setNeedToSetFirstPosts] = useState(true);

    const getMessages = () => {
        setLoading(true);
        axios.post('posts/topposts', { "pageNumber": pageNumber })
            .then((res) => {
                console.log(res)
                if (res && res.data && res.data.data) {
                    console.log(res.data.data.messages);
                    setLoading(false);
                    setMessages(messages.concat(res.data.data));
                    setPageNumber(pageNumber + 1);
                }
            });
    }

    if (needToFetchFirstPosts) {
        setNeedToSetFirstPosts(false);
        getMessages();
    }
        

    const loadMore = () => {
        getMessages();
    }


    return (
        <div>
            {messages.map(message => <Message message={message} parentPage={true} />)}
            {loading ?
                (<center>
                    <CircularProgress color='inherit' />
                </center>)
                : (<button onClick={loadMore}>Load More</button>)
            }
        </div>
    );
}

/** 
function getMessages(parentMessages, setMessages, setLoading) {
  setLoading(true);
  axios.post('posts/topposts', {"pageNumber": 0})
    .then((res) => {
      console.log(res)
      if (res && res.data && res.data.data) {
        console.log(res.data.data.messages);
        setLoading(false);
        setMessages(parentMessages.concat(res.data.data));
      }
    });
}
*/