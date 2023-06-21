import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, Stack } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import PaletteIcon from '@mui/icons-material/Palette';
import { HexColorPicker } from 'react-colorful';
import '../../firebase'
import { child, getDatabase, onChildAdded, push, ref, update } from 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../store/themeReducer';

function ThemeMenu() {
    const {user} = useSelector(state=>state)
    const dispatch = useDispatch()
    const [showTheme, setShowTheme] = useState(false);
    const [mainTheme, setMainTheme] = useState('#ffffff')
    const [subTheme, setSubTheme] = useState('#ffffff')
    const [userTheme, setUserTheme] = useState([])
    const paletteOpen = useCallback(() => setShowTheme(true), [])
    const paltteClose = useCallback(() => setShowTheme(false), [])

    const saveTheme = useCallback(async () => {
        if(!user.currentUser?.uid) return
        try {
            const db = getDatabase()
            const key = push(child(ref(db),'/users/'+user.currentUser.uid+'/theme')).key
            const newTheme = {mainTheme, subTheme};
            const updates = {};
            updates['/users/'+user.currentUser.uid+'/theme/'+key] = newTheme;
            await update(ref(db), updates);
        } catch (error) {
            console.error(error)
        }
        paltteClose()
    }, [mainTheme,subTheme, user.currentUser?.uid, paltteClose])

    useEffect(() => {
        if(!user.currentUser?.uid) return
        const db = getDatabase()
        const themeRef = ref(db,'/users/'+user.currentUser.uid+'/theme');
        const unsubscribe = onChildAdded(themeRef, (snap)=>{
            setUserTheme((themeArr)=>[snap.val(), ...themeArr])
        })
        return ()=>{
            setUserTheme([]);
            unsubscribe?.();
        }

    }, [user.currentUser?.uid])
    

    return (
        <>
            <List sx={{overflow:'auto', width:60, backgroundColor:'#150c16'}}>
                <ListItem>
                    <ListItemButton sx={{p:0}} onClick={paletteOpen}>
                        <ListItemIcon sx={{color:'white'}}>
                            <PaletteIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem> 
                {
                    userTheme.map((theme, idx)=>(
                        <ListItem key={idx} >
                            <div className='theme-box' onClick={dispatch(setTheme(theme.mainTheme, theme.subTheme))}>
                                <div className='theme-main' style={{backgroundColor:theme.mainTheme}}>
                                    
                                </div>
                                <div className='theme-sub' style={{backgroundColor:theme.subTheme}}>

                                </div>
                            </div>
                        </ListItem>
                    ))
                }               
                
                <Dialog open={showTheme} onClose={paltteClose}>
                    <DialogTitle>테마 색상 선택</DialogTitle>
                    <DialogContent>
                        <Stack direction='row' spacing={2}>
                            <div>
                                Main
                                <HexColorPicker color={mainTheme} onChange={(color)=>setMainTheme(color)} />
                            </div>
                            <div>
                                Sub
                                <HexColorPicker color={subTheme} onChange={(color)=>setSubTheme(color)} />
                            </div>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={paltteClose}>취소</Button>
                        <Button onClick={saveTheme}>적용</Button>
                    </DialogActions>
                </Dialog>
            </List>
        </>
    )
}

export default ThemeMenu
