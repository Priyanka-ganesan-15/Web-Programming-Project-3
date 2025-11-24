import React, {useState} from 'react';
import {Stack, TextField, Button, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {postLogin} from '../../api';
import appStore from "../../src/context/appStore.js";

function Login() {
    const navigate = useNavigate();
    const setLoggedInUser = appStore((s) => s.setLoggedInUser);

    // Single object state for login
    const [loginObject, setLoginObject] = useState({
        login_name: '',
        password: ''
    });

    const loginMutation = postLogin();

    const handleLogin = () => {
        // Send login_name only for now if API only accepts that; can update later for password
        loginMutation.mutate(loginObject, {
            onSuccess: (user) => {
                setLoggedInUser(user);
                navigate('/', {replace: true});
            }
        });
    };

    const loginErrorMessage = loginMutation.error ? loginMutation.error.response.data.error : '';
    console.log(loginMutation.error);

    return (
        <Stack spacing={2} alignItems="center">
            <Typography variant="h5">Login</Typography>

            <TextField
                label="Login Name"
                variant="outlined"
                fullWidth
                value={loginObject.login_name}
                onChange={(e) => setLoginObject({...loginObject, login_name: e.target.value})}
                error={!!loginMutation.error}
                helperText={loginErrorMessage}
            />

            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={loginObject.password}
                onChange={(e) => setLoginObject({...loginObject, password: e.target.value})}
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
    );
}

export default Login;