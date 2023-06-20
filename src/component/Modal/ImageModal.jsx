import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input } from '@mui/material'
import React, { useCallback, useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import '../../firebase'
import {getDownloadURL, getStorage, ref as ref_storage, uploadBytesResumable} from 'firebase/storage'
import { getDatabase, push, ref, serverTimestamp, set } from 'firebase/database'
import { useSelector } from 'react-redux'

function ImageModal({open, handleClose, setPercent, setUploading}) {
    const {channel, user} = useSelector(state=>state);

    const [file, setFile] = useState(null)

    const addFile = useCallback((e)=>{
        const fileItem = e.target.files[0]
        if(fileItem) setFile(fileItem);
    }, []);

    const createImageMessage = useCallback((fileUrl)=>({
        timestamp:serverTimestamp(),
        user:{
            id:user.currentUser.uid,
            name:user.currentUser.displayName,
            avatar:user.currentUser.photoURL
        },
        image:fileUrl
    }),[user.currentUser.uid, user.currentUser.displayName, user.currentUser.photoURL])
    

    const uploadFile = useCallback(() => {
        setUploading(true)
        const filePath = `chat/${uuidv4()}.${file.name.split('.').pop()}`;
        const uploadTask = uploadBytesResumable(ref_storage(getStorage(),filePath), file)
        const unsubscribe = uploadTask.on('state_changed', (snap)=>{
            const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
            setPercent(percentUploaded)
        }, (error)=>{
            setUploading(false)
            console.error(error)
        }, async () => {
            try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
                await set(
                    push(ref(getDatabase(),'messages/'+channel.currentChannel?.id)),
                    createImageMessage(downloadUrl)
                )
                unsubscribe()
            } catch (error) {
                setUploading(false)
                console.error(error);
                unsubscribe();
            }
        }
        );
    }, [channel.currentChannel?.id, createImageMessage, file, setPercent, setUploading])

    const sendFile = useCallback(() => {
        uploadFile()
        handleClose()
        setFile(null)
    }, [handleClose, uploadFile])

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>이미지 보내기</DialogTitle>
            <DialogContent>
                <Input 
                    margin='dense' 
                    inputProps={{accept:'image/jpeg, image/jpg, image/png, image/gif'}}
                    type='file'
                    fullWidth
                    variant='standard'
                    onChange={addFile}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>취소</Button>
                <Button onClick={sendFile}>전송</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImageModal
