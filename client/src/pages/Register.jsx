import React,{ useState, useEffect, useContext } from "react";
import { Grid, Box, TextField, Button, Backdrop, CircularProgress, Typography } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import { loginPhotos } from "../helper";
import axios from "axios";
import { ContextProvider } from "../context";

export default function Login() {
    const [showBackdrop, setShowbackdrop] = useState(true);
    const { authdispatch } = useContext(ContextProvider)
    const navigate = useNavigate();

    useEffect(() => {
        let imgsrc = `https://source.unsplash.com/${loginPhotos[Math.floor(Math.random()*loginPhotos.length)]}/960x1080`;
        document.querySelector("img").setAttribute('src',imgsrc);
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const vals = Object.fromEntries(formdata);
        axios.post('/auth/register',vals).then((res) => {
            //let { data } = res;
            axios.post('/auth/login',vals).then(({data}) => {
                authdispatch({type: 'LOGIN', payload: data});
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                authdispatch({type: 'STOP_LOADING'});
                navigate('/');
            });
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            authdispatch({type: 'STOP_LOADING'});
        });
    }
    
    return (
        <Grid container width="100%" height="100%">
            <Grid item xs={12} lg={6} display="flex" justifyContent="center" alignItems="center">
                <Box width="100%" maxWidth={450} component="form" onSubmit={handleSubmit}>
                    <Grid container>
                    <Grid item xs={12} textAlign="center">
                        <Typography component="h1" variant="h4" mb={2}>
                            Kayıt Ol
                        </Typography>
                    </Grid>
                        <Grid item xs={12} mb={2}>
                            <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            />
                        </Grid>
                        <Grid item xs={12} mb={2}>
                            <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            />
                        </Grid>
                        <Grid item xs={12} textAlign="right">
                        <Button 
                        onClick={() => navigate('/login')}
                        sx={{ py:1.5, maxWidth: 160 }}>
                            Giriş Yap
                        </Button>
                        <Button variant="contained" sx={{ py:1.5, maxWidth: 160 }} fullWidth type="submit">
                            Kayıt ol
                        </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} lg={6} overflow="hidden" height="100%" display={{xs: 'none', lg: 'block'}}>
                <Box 
                display="flex"
                justifyContent="center"
                position="relative"
                alignItems="center"
                overflow="hidden"
                width="100%"
                height="100%">
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
                        open={showBackdrop}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <img 
                    onLoad={() => setShowbackdrop(false)}
                    src=""
                    alt="login" />
                </Box>
            </Grid>
        </Grid>
    )
}
