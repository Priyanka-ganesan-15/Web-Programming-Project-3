import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
    Alert, Box, Typography, Skeleton,
} from '@mui/material';
import {fetchUserComments} from "../../api.js";
import CommentItem from './comment';
import appStore from "../../src/context/appStore.js";

function UserComments() {
    const {userId} = useParams();
    const advanced = appStore((s) => s.advanced);
    const {data: comments = [], isLoading, error} = fetchUserComments(userId);

    const setPage = appStore((s) => s.setPage);

    useEffect(() => {
        setPage('Comments');
    },[]);

    if (!advanced) {
        return (
            <Box p={3} display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Typography variant="h6" textAlign="center">
                    Comments View Unavailable
                </Typography>
                <Alert severity="info">
                    Enable Advanced Features to view comments.
                </Alert>
                <Typography variant="body2" color="textSecondary" textAlign="center">
                    Check the Advanced Features checkbox in the top bar to unlock this feature.
                </Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box p={2}>
                <Skeleton variant="text" width={200} height={30} sx={{mb: 2}}/>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                    {[1, 2, 3].map((i) => (
                        <Box key={i} sx={{display: 'flex', gap: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1}}>
                            <Skeleton variant="rectangular" width={60} height={60} sx={{borderRadius: 1}}/>
                            <Box sx={{flex: 1}}>
                                <Skeleton variant="text" width="80%" height={20}/>
                                <Skeleton variant="text" width="40%" height={16}/>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Alert severity="error">{error.message}</Alert>
            </Box>
        );
    }

    if (comments.length === 0) {
        return (
            <Box p={3} display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Typography variant="h6" textAlign="center">
                    No Comments Yet
                </Typography>
                <Typography variant="body2" color="textSecondary" textAlign="center">
                    This user has not written any comments yet.
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Typography variant="subtitle2" color="textSecondary" mb={2}>
                {comments.length}
                {' '}
                comment
                {comments.length !== 1 ? 's' : ''}
            </Typography>

            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                {comments.map((comment) => (
                    <CommentItem key={comment.comment_id} comment={comment}/>
                ))}
            </Box>
        </Box>
    );
}

export default UserComments;