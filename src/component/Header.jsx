import React from 'react'
import { AppBar, Toolbar, Box, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import { useSelector } from 'react-redux';

function Header() {

    const {user} = useSelector(state => state)

    return (
        <>
        {/* TODO backgroundColor 테마적용 */}
            <AppBar position='fixed' sx={{zIndex:(theme)=> theme.zIndex.drawer+1, color:'#9a939b', backgroundColor:'4c3c4c'}}>
                <Toolbar sx={{display:'flex', justifyContent:'space-between', height:'50px'}}>
                    <Box sx={{display:'flex'}}>
                        <TagIcon />
                        <Typography variant='h6' component='div' >
                            SLACK
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton>
                            <Typography variant='h6' component='div' >
                                {user.currentUser?.display}
                            </Typography>
                            <Avatar sx={{marginLeft:'10px'}} alt='profileImage' scr={user.currentUser?.photoURL} />
                        </IconButton>
                        <Menu sx={{mt:'45px'}}>
                            <MenuItem></MenuItem>
                            <MenuItem></MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Header
