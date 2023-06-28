import React, { useCallback, useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import "../../firebase";
import {child, getDatabase, onChildAdded, push, ref, update} from 'firebase/database'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from '../../store/channelReucer';

function ChannelMenu() {
    const {theme} = useSelector(state=>state)
    const [open, setOpen] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [channelDetail, setChannelDetail] = useState('');
    const [channels, setChannels] = useState([]);
    const [activeChannelId, setActiveChannelId] = useState('');
    const [firstLoaded, setFirstLoaded] = useState(true)
    const dispatch = useDispatch();
    const handleClose = () =>{
        setOpen(false)
        setChannelName('')
        setChannelName('')
    }
    const handleOpen = () =>{
        setOpen(true)
    }

    useEffect(()=>{
        const unsubscribe = onChildAdded(ref(getDatabase(), 'channels'), (snapshot)=>{
            setChannels((channelArr)=>[...channelArr, snapshot.val()])
        })
        return () => {
            setChannels([])
            unsubscribe()
        }
    },[]);

    const changeChannel = (channel) => {
        setActiveChannelId(channel.id);
        dispatch(setCurrentChannel(channel))
    }

    const handleSubmit = useCallback(async () => {
        const db = getDatabase();
        const key = push(child(ref(db), 'channels')).key;
        const newChannel = {
            id:key,
            name:channelName,
            details:channelDetail
        };

        const updates = {};
        updates['/channels/'+key] = newChannel;

        try {
            await update(ref(db), updates)
            handleClose()
        } catch (error) {
            console.error(error)
        }
    }, [channelDetail, channelName])

    useEffect(()=>{
        if(channels.length > 0 && firstLoaded){
            setActiveChannelId(channels[0].id);
            dispatch(setCurrentChannel(channels[0]))
            setFirstLoaded(false)
        }
    },[channels, dispatch, firstLoaded])

    return (
        <>
            {/* TODO 테마반영 */}
            <List sx={{overflow:'auto', width:240, backgroundColor:theme.mainTheme}}>
            {/* <List sx={{overflow:'auto', width:240, backgroundColor:'#000'}}> */}
                <ListItem secondaryAction={
                    <IconButton sx={{color:'#9a939b'}} onClick={handleOpen}>
                        <AddIcon />
                    </IconButton>
                }>
                    <ListItemIcon sx={{color:'#9a939b'}} >
                        <ArrowDropDownIcon />
                    </ListItemIcon>
                    <ListItemText primary='채널' sx={{wordBreak:'break-all', color:'#9a939b'}} />
                </ListItem>
                <List component='div' disablePadding sx={{pl:3}}>
                    {
                        channels.map(channel=>(
                            <ListItemButton 
                                key={channel.id} 
                                onClick={()=>changeChannel(channel)}
                                selected={channel.id === activeChannelId}
                            >
                                <ListItemText primary={`# ${channel.name}`} sx={{wordBreak:'break-all', color:'#918890'}} />
                            </ListItemButton>
                        ))
                    }
                </List>
            </List>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>채널 추가</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{marginBottom:'10px'}}>
                        생성할 채널명과 설명을 입력해주세요.
                    </DialogContentText>
                    <TextField autoFocus margin='dense' label='채널명' type='text' fullWidth variant='standard' onChange={(e)=>setChannelName(e.target.value)} />
                    <TextField autoFocus margin='dense' label='설명' type='text' fullWidth variant='standard' onChange={(e)=>setChannelDetail(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleSubmit}>생성</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ChannelMenu
