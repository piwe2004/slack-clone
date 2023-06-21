import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Stack } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { useSelector } from 'react-redux'
import '../../firebase'
import { getDownloadURL, getStorage, ref as refStorage, uploadBytes } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { getDatabase, ref, update } from 'firebase/database'

function ProfileModal({open, handleClose}) {
    const {user} = useSelector(state=>state)
    const [previewImage, setPreviewImage] = useState('');
    const [uploadedCroppedImage, setUploadedCroppedImage] = useState('')
    const [croppedImage, setCroppedImage] = useState('')
    const [blob, setBlob] = useState('')
    const avatarEditorRef = useRef()

    const closeModal = useCallback(() => {
        handleClose();
        setPreviewImage('')
        setCroppedImage('')
        setUploadedCroppedImage('')
    }, [handleClose])

    const chageProfile = useCallback((e) =>{
        const file = e.target.files[0]
        if(!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.addEventListener('load', ()=>{
            setPreviewImage(reader.result)
        });

    }, [])

    const cropImage = useCallback(()=>{
        avatarEditorRef.current.getImageScaledToCanvas().toBlob((blob)=>{
            const imageUrl = URL.createObjectURL(blob);
            setCroppedImage(imageUrl);
            setBlob(blob)
        });
    }, [])

    const changeProfile = useCallback( async () => {
        if(!user.currentUser?.uid) return;
        const storageRef = refStorage(getStorage(), `avatars/users/${user.currentUser.uid}`);
        const uploadTask = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(uploadTask.ref);
        setUploadedCroppedImage(downloadUrl)

    }, [blob, user.currentUser?.uid])

    useEffect(()=>{
        if(!uploadedCroppedImage || !user.currentUser) return
        async function changeAvatar(){
            await updateProfile(user.currentUser, {
                photoURL:uploadedCroppedImage
            });
            const updates = {};
            updates["/users/" + user.currentUser.uid + "/avatar"] = uploadedCroppedImage;
            await update(ref(getDatabase()), updates);
            closeModal()
        }
        
        changeAvatar()
    }, [uploadedCroppedImage, user.currentUser, closeModal])

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>프로필 이미지 변경</DialogTitle>
            <DialogContent>
                <Stack direction='column' spacing={3}>
                    <Input 
                        type='file'
                        inputProps={{accept:'image/jpeg, image/jpg, image/png, image/gif'}}
                        label='변경할 프로필 이미지 선택'
                        onChange={chageProfile}
                    />
                    <div style={{display:'flex', alignItems:'center'}}>
                        {previewImage && (
                            <AvatarEditor 
                                image={previewImage} 
                                width={120} 
                                height={120} 
                                border={50} 
                                scale={2} 
                                style={{display:'inline'}} 
                                ref={avatarEditorRef}
                            />
                        )}
                        {
                            croppedImage && (
                                <img alt='cropped' style={{marginLeft:'50px'}} width={100} height={100} src={croppedImage} />
                            )
                        }
                    </div>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal}>취소</Button>
                {
                    previewImage && (
                        <Button onClick={cropImage}>이미지 자르기</Button>
                    )
                }
                {
                    croppedImage && (
                        <Button onClick={changeProfile}>프로필 이미지 저장</Button>
                    )
                }
            </DialogActions>
        </Dialog>
    )
}

export default ProfileModal
