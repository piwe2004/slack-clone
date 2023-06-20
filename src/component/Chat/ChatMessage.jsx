import { Avatar, Grid, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);


function ChatMessage({message, user}) {

    const IsImages = (message) => message.hasOwnProperty('image')

    return (
        <ListItem>
            <ListItemAvatar sx={{alignSelf:'stretch'}}>
                <Avatar 
                    variant='rounded' 
                    sx={{width:50, height:50}} 
                    alt='profile image'
                    src={message.user.avatar}
                />
            </ListItemAvatar>
            <Grid container sx={{ml:2}}>
                <Grid item xs={12} sx={{display:'flex', justifyContent:'left'}} >
                    <ListItemText 
                        sx={{display:'flex', mb:0}} 
                        primary={message.user.name} 
                        primaryTypographyProps={{fontWeight:'bold', color:message.user.id === user.currentUser?.uid ?"orange" : 'black'}} 
                        secondary={dayjs(message.timestamp).fromNow()}
                        secondaryTypographyProps={{color:'gray', ml:1}}
                    >
                        
                    </ListItemText>
                </Grid>
                <Grid item xs={12}>
                    {
                        IsImages(message) 
                        ? <img alt="message" src={message.image} style={{maxWidth:'100%'}} />
                        : <ListItemText align='left' sx={{wordBreak:'break-all'}} primary={message.content} />
                    }
                </Grid>
            </Grid>
        </ListItem>
    )
}

export default ChatMessage
