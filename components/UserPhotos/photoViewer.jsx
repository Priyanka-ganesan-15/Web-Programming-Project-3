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
    Button,
} from '@mui/material';
import PhotoComments from "./photoComments.jsx";

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
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};

function PhotoViewer({ photo, currentIndex, totalPhotos, userId, stepper }) {
    return (
        <Stack spacing={2} sx={{ p: 1 }}>
            <Button component={RouterLink} to={`/users/${userId}`} variant="text">
                Back to user
            </Button>

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
                                onClick={() => stepper(-1)}
                                disabled={currentIndex === 0}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => stepper(1)}
                                disabled={currentIndex === totalPhotos - 1}
                            >
                                Next
                            </Button>
                        </Stack>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle2">Comments</Typography>
                            <PhotoComments comments={photo.comments} />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}

export default PhotoViewer;
