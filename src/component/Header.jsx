import React, { useCallback } from 'react'
import { AppBar, Toolbar, Box, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import "../firebase"
import { getAuth, signOut } from 'firebase/auth';
import ProfileModal from './Modal/ProfileModal';

function Header() {

    const {user, theme} = useSelector(state => state)
    const [anchorEl, setAnchorEl] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false)

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const openProfile = useCallback(() => {
        setShowProfileModal(true)
        handleCloseMenu()
    }, [handleCloseMenu])

    const closeProfile = useCallback(() => {
        setShowProfileModal(false)
    }, [])


    const handleLogOut = async() => {
        await signOut(getAuth())
        setAnchorEl(null)
    }


    return (
        <>
        {/* TODO backgroundColor 테마적용 */}
            <AppBar position='fixed' sx={{zIndex:(theme)=> theme.zIndex.drawer+1, color:'#9a939b', backgroundColor:theme.mainTheme}}>
                <Toolbar sx={{display:'flex', justifyContent:'space-between', height:'50px'}}>
                    <Box sx={{display:'flex'}}>
                        <TagIcon />
                        <Typography variant='h6' component='div' >
                            SLACK
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={(e)=>setAnchorEl(e.currentTarget)}>
                            <Typography variant='h6' component='div' sx={{color:"#fff"}}>
                                {user.currentUser?.displayName}
                            </Typography>
                            <Avatar sx={{marginLeft:'10px'}} alt='profileImage' src={user.currentUser?.photoURL} />
                        </IconButton>
                        <Menu sx={{mt:'45px'}} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} anchorOrigin={{vertical:'top', horizontal:'right'}}>
                            <MenuItem onClick={openProfile}>
                                <Typography textAlign="center">프로필 이미지</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogOut}>
                                <Typography textAlign="center">Log Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <ProfileModal open={showProfileModal} handleClose={closeProfile} />
        </>
    )
}

export default Header
