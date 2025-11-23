// PhotoViewer.jsx
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
    Button,
    Link,
} from '@mui/material';

// Helper: format date safely
export const formatDate = (dateStr) => {
    try {
        const d = new Date(dateStr);
        return d.toLocaleString();
    } catch (e) {
        return dateStr;
    }
};

// Helper: commenter initials for Avatar
export const initials = (user) => {
    if (!user) return '?';
    const first = user.first_name || '';
    const last = user.last_name || '';
    const f = first.charAt(0) || '';
    const l = last.charAt(0) || '';
    return `${f}${l}`.toUpperCase();
};

function PhotoViewer({
                         photo,
                         currentIndex,
                         totalPhotos,
                         userId,
                         photoNotFound,
                         stepper,
                     }) {
    return (
        <Stack spacing={2} sx={{ p: 1 }}>
            <Button component={RouterLink} to={`/users/${userId}`} variant="text">
                Back to user
            </Button>

            {photoNotFound && (
                <Box sx={{ p: 1, backgroundColor: '#fff3cd', borderRadius: 1, border: '1px solid #ffc107' }}>
                    <Typography variant="body2" sx={{ color: '#856404' }}>
                        Photo not found, showing first photo
                    </Typography>
                </Box>
            )}

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
                            Photo {currentIndex + 1} of {totalPhotos}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            {formatDate(photo.date_time)}
                        </Typography>

                        {/* Navigation buttons */}
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                onClick={()=>stepper(-1)}
                                disabled={currentIndex === 0}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={()=>stepper(1)}
                                disabled={currentIndex === totalPhotos - 1}
                            >
                                Next
                            </Button>
                        </Stack>

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
        </Stack>
    );
}

export default PhotoViewer;