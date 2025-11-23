// PhotoCard.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Divider,
    Stack,
    Box,
    Avatar,
    Link,
} from '@mui/material';
import {formatDate, initials} from "./photoViewer.jsx";

function PhotoCard({ photo }) {
    return (
        <Card>
            {photo.file_name && (
                <CardMedia
                    component="img"
                    image={`/images/${photo.file_name}`}
                    alt={photo.file_name}
                    sx={{ maxHeight: 500, objectFit: 'contain' }}
                />
            )}

            <CardContent>
                <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(photo.date_time)}
                    </Typography>

                    <Divider />

                    <Box>
                        <Typography variant="subtitle2">Comments</Typography>

                        {!photo.comments || photo.comments.length === 0 ? (
                            <Typography variant="body2">No comments yet.</Typography>
                        ) : (
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                {photo.comments.map((comment) => (
                                    <Box key={comment._id} sx={{ display: 'flex', gap: 1 }}>
                                        <Avatar sx={{ width: 36, height: 36, fontSize: 12 }}>
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
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default PhotoCard;