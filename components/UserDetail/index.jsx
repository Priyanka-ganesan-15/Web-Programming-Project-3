import React, {useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    CircularProgress,
    Box,
} from '@mui/material';
import {fetchUserDetails} from "../../api";
import appStore from "../../src/context/appStore.js";

function UserDetail({userId}) {
    const {data: user, isLoading, error} = fetchUserDetails(userId);

    const setPage = appStore((s) => s.setPage);
    useEffect(() => {
        setPage('Details');
    }, []);

    if (isLoading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" p={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={20}/>
                    <Typography variant="body2">Loading user…</Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error" variant="body2">Error: {error.message}</Typography>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box p={2}>
                <Typography variant="body1">User not found.</Typography>
                <Button component={RouterLink} to="/users" sx={{mt: 1}}>
                    Back to users
                </Button>
            </Box>
        );
    }

    const fullName = `${user.first_name} ${user.last_name}`;

    return (
        <Card sx={{p: 1}}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5">{fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.occupation}
                    </Typography>
                    <Typography variant="body1">{user.description}</Typography>

                    <Stack direction="row" spacing={1} sx={{mt: 1}}>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to={`/photos/${userId}`}
                        >
                            {`Photos of ${user.first_name}`}
                        </Button>

                        <Button variant="text" component={RouterLink} to="/users">
                            Back to users
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default UserDetail;