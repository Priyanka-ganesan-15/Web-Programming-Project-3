import React, {useState} from 'react';
import {Stack, TextField, Button, Typography} from '@mui/material';
import {postRegister} from "../../api.js";

function RegisterSection() {
    const [registerObject, setRegisterObject] = useState({
        login_name: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: ''
    });
    const registerMutation = postRegister();
    const registerMutationError = registerMutation.error ? (registerMutation.error.response.data.error ?? '') : '';
    const handleRegister = () => {
        registerMutation.mutate(registerObject, {
            onSuccess: (user) => {
                //setLoggedInUser(user); // we probably want to log you in on success right?
                //navigate('/', {replace: true});
                console.log(user);
            }
        });
    };

    return (
        <Stack spacing={2} alignItems="center">
            <Typography variant="h5">Register</Typography>

            {Object.keys(registerObject).map((field) => (
                <TextField
                    key={field}
                    label={field.replace('_', ' ')}
                    variant="outlined"
                    fullWidth
                    type={field.includes('password') ? 'password' : 'text'}
                    value={registerObject[field]}
                    error={!!registerMutationError.error}
                    helperText={registerMutationError}
                    onChange={(e) => {
                        setRegisterObject({...registerObject, [field]: e.target.value});
                    }}
                />
            ))}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegister}
            >
                Register
            </Button>
        </Stack>
    );
}

export default RegisterSection;