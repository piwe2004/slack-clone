import React from 'react'
import { Box, Drawer, Toolbar } from '@mui/material';
import Header from '../component/Header';
import ChannelMenu from '../component/Menu/ChannelMenu';
import Chat from '../component/Chat/Chat';
import ThemeMenu from '../component/Menu/ThemeMenu';
import { useSelector } from 'react-redux';

function Main() {
    const {theme} = useSelector(state => state)

    return (
        // TODO backgroundColor 테마 적용
        <Box sx={{display:'flex', backgroundColor:theme.subTheme}}>
            <Header />
            <Drawer variant='permanent' sx={{width:300}} className='no-scroll'>
                <Toolbar />
                <Box sx={{display:'flex', height:'100%', minHeight:'calc( 100vh - 64px )'}} >
                    <ThemeMenu />
                    <ChannelMenu />
                </Box>
            </Drawer>
            <Box component='main' sx={{flexGrow:1, p:3}}>
                <Chat />
            </Box>
        </Box>
    )
}

export default Main
