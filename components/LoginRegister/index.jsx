import * as React from 'react';
import {useState} from 'react';
import {Box, TextField, Button, Typography, Stack} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {postLogin} from '../../api';
import appStore from "../../src/context/appStore.js";

function LoginRegister() {
    //i think its fine to just use the state here rather than the store? its only local
    const [loginName, setLoginName] = useState('');
    const navigate = useNavigate();
    const setLoggedInUser = appStore((s) => s.setLoggedInUser);
    const loginMutation = postLogin();

    const handleLogin = () => {
        if (!loginName.trim()) {
            return;
        }

        loginMutation.mutate(loginName, {
            onSuccess: (user) => {
                setLoggedInUser(user);
                navigate('/', {replace: true});
            },
        });
    };

    const errorMessage = loginMutation.error ? 'Login failed. Please check your username.' : '';

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Stack spacing={2} alignItems="center" sx={{width: 320}}>
                <Typography variant="h5">Login / Register</Typography>

                <TextField
                    label="Login Name"
                    variant="outlined"
                    fullWidth
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    error={!!loginMutation.error}
                    helperText={errorMessage}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
            </Stack>
        </Box>
    );
}

export default LoginRegister;