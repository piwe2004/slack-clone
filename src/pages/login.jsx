import React from 'react'
import { Alert, Avatar, Box, Container, Grid, TextField, Typography } from '@mui/material'
import TagIcon from '@mui/icons-material/Tag';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../firebase"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';

function Login() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const handleSubmit = (e) =>{
        e.preventDefault();
        const data = new FormData(e.currentTarget)
        const email = data.get('email');
        const password = data.get('password');        

        if(!email || !password){
            if(!email && !password) {
                setError('이메일과 비밀번호를 확인해 주세요.')
            }else{
                setError(!email ? '이메일을 확인해 주세요' : '비밀번호를 확인해 주세요')
            }
            return;
        }
        loginUser(email, password);
    }

    const loginUser = async (email, password) => {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(!error) return;
        setTimeout(() => {
            setError('');
        }, 3000);
    }, [error])
    
    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ 
                    display: "flex", 
                    flexDirection:'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh'
                }}
            >
                <Avatar sx={{m:1, bgcolor:'secondary.main'}} >
                    <TagIcon />
                </Avatar>
                <Typography component="h1" variant='h5'>
                    로그인
                </Typography>
                <Box component='form' noValidate sx={{mt:3}} onSubmit={handleSubmit} >
                    <TextField margin='normal' required fullWidth label="이메일 주소" name="email" autoComplete="off" autoFocus />
                    <TextField type="password" required fullWidth label="비밀번호" name="password" autoComplete="off" autoFocus />
                    {
                        error 
                            ? <Alert sx={{mt:3}} severity='error'>{error}</Alert>
                            : ''
                    }
                    <LoadingButton type='submit' fullWidth variant='contained' color='secondary' loading={loading} sx={{mt:3, mb:2}}>로그인</LoadingButton>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/join" style={{textDecoration:'none', color:'blue'}}>
                                계정이 없으신가요? 회원가입으로 이동
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default Login
