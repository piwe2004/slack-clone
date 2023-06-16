import React from 'react'
import { Box, Drawer, Toolbar } from '@mui/material';
import Header from '../component/Header';
import ChannelMenu from '../component/ChannelMenu';

function Main() {
    return (
        // TODO backgroundColor 테마 적용
        <Box sx={{display:'flex', backgroundColor:'white'}}>
            <Header />
            <Drawer variant='permanent' sx={{width:300}} className='no-scroll'>
                <Toolbar />
                <Box sx={{idsplay:'flex', minHeight:'calc( 100vh - 64px )'}} >
                    <ChannelMenu />
                </Box>
            </Drawer>
        </Box>
    )
}

export default Main
