import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Stack, Avatar, Typography, Link} from '@mui/material';
import {formatDate, initials} from './photoHelpers';

function PhotoComments({comments}) {
    if (!comments || comments.length === 0) {
        return <Typography variant="body2">No comments yet.</Typography>;
    }

    return (
        <Stack spacing={2} sx={{mt: 1}}>
            {comments.map((comment) => (
                <Box key={comment._id} sx={{display: 'flex', gap: 1}}>
                    <Avatar sx={{width: 36, height: 36, fontSize: 12}}>
                        {initials(comment.user)}
                    </Avatar>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Link
                                component={RouterLink}
                                to={`/users/${comment.user._id}`}
                                underline="hover"
                            >
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    component="span"
                                >
                                    {`${comment.user.first_name} ${comment.user.last_name}`}
                                </Typography>
                            </Link>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(comment.date_time)}
                            </Typography>
                        </Stack>

                        <Typography variant="body2">{comment.comment}</Typography>
                    </Box>
                </Box>
            ))}
        </Stack>
    );
}

export default PhotoComments;
