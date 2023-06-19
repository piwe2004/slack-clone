import { Divider, Grid, List, Paper, Toolbar } from '@mui/material'
import React from 'react'
import ChatHeader from './ChatHeader'
import { useSelector } from 'react-redux'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

function Chat() {

    const {channel} = useSelector((state)=> state)

    return (
        <>
            <Toolbar />
            <ChatHeader channelInfo={channel.currentChannel} />
            <Grid container component={Paper} variant='outlined' sx={{mt:3, position:'relative'}}>
                <List sx={{height:'calc(100vh - 350px)', overflow:'sxroll', width:'100%', position:'relative'}}>
                    <ChatMessage />
                </List>
                <Divider />
                <ChatInput />
            </Grid>
        </>
    )
}

export default Chat
