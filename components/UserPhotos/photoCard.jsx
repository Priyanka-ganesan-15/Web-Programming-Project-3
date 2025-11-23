import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Divider,
    Stack,
    Box,
} from '@mui/material';
import {formatDate} from "./photoHelpers";
import PhotoComments from "./photoComments";

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
                        <PhotoComments comments={photo.comments} />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default PhotoCard;