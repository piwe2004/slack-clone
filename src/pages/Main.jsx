import React from 'react'
import { Box } from '@mui/material';
import Header from '../component/Header';

function Main() {
    return (
        // TODO backgroundColor 테마 적용
        <Box sx={{display:'flex', backgroundColor:'white'}}>
            <Header />
        </Box>
    )
}

export default Main
