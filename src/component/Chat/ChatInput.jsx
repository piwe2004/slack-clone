import { Grid, IconButton, InputAdornment, LinearProgress, TextField } from '@mui/material'
import React, { useCallback, useState } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import '../../firebase'
import { getDatabase, push, ref, serverTimestamp, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import Picker from '@emoji-mart/react'
import ImageModal from '../Modal/ImageModal';


function ChatInput() {
    const { channel, user } = useSelector(state => state)
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)
    const [imagesModalOpen, setImagesModalOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [percent, setPercent] = useState(0)
    const handleMessage = useCallback((e) => setMessage(e.target.value), []);
    const createMessage = useCallback(() => ({
        timestamp: serverTimestamp(),
        user: {
            id: user.currentUser.uid,
            name: user.currentUser.displayName,
            avatar: user.currentUser.photoURL
        },
        content: message
    }), [message, user.currentUser.uid, user.currentUser.displayName, user.currentUser.photoURL])

    const clickSendMessage = useCallback(async () => {
        if (!message) return;
        setLoading(true)
        try {
            await set(
                push(ref(getDatabase(), 'messages/' + channel.currentChannel.id)),
                createMessage()
            );
            setLoading(false);
            setShowEmoji(false)
            setMessage('')
        } catch (error) {
            console.error(error)
        }

    }, [message, channel.currentChannel?.id, createMessage])

    const handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            clickSendMessage()
        }
    }


    const handleTogglePicker = () => setShowEmoji((show) => !show)

    const addEmoji = useCallback((e) => {
        const sym = e.unified.split('-');
        const codesArray = [];
        sym.forEach(el => codesArray.push('0x'+el));
        const emoji = String.fromCodePoint(...codesArray);
        console.log(emoji)
        setMessage((messageValue)=>messageValue+emoji);
        console.log(message)
    }, [])

    const handleClickOpen = () => setImagesModalOpen(true)
    const handleClickClose = () => setImagesModalOpen(false)

    return (
        <Grid container sx={{ p: '20px' }}>
            <Grid item xs={12} sx={{ position: 'relative' }}>
                {showEmoji && (
                    <div style={{ position: 'absolute', bottom: '80px' }}>
                        <Picker 
                            set='google' 
                            className='emojipicker' 
                            previewEmoji='point_up'
                            title='이모티콘을 선택해 주세요.'
                            onEmojiSelect={addEmoji}
                        />
                    </div>
                )}
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start' >
                                <IconButton onClick={handleTogglePicker}>
                                    <InsertEmoticonIcon />
                                </IconButton>
                                <IconButton onClick={handleClickOpen}>
                                    <ImageIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position='start'>
                                <IconButton disabled={loading} onClick={clickSendMessage}>
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    onKeyUp={handleKeyUp}
                    label='메세지 입력'
                    fullWidth
                    value={message}
                    onChange={handleMessage}
                />
                {
                    uploading 
                    ?  <Grid item xs={12} sx={{m:'10px'}}>
                        <LinearProgress variant='determinate' value={percent} />
                    </Grid>
                    :null
                }
                <ImageModal open={imagesModalOpen} handleClose={handleClickClose} setPercent={setPercent} setUploading={setUploading} />
            </Grid>
        </Grid>
    )
}

export default ChatInput
