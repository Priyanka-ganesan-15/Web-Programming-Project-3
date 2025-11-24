import React from 'react';
import {Box, Stack, Divider} from '@mui/material';
import LoginSection from './login';
import RegisterSection from './register';

export default function LoginRegister() {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Stack spacing={4} sx={{width: 360}}>
                <LoginSection/>
                <Divider/>
                <RegisterSection/>
            </Stack>
        </Box>
    );
}
