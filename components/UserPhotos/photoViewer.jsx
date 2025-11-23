import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Stack, Button, Typography} from '@mui/material';
import {formatDate} from "./photoHelpers.js";
import PhotoCard from "./photoCard.jsx";

function PhotoViewer({photo, currentIndex, totalPhotos, userId, stepper}) {

    return (
        <Stack spacing={2} sx={{p: 1}}>
            <Button component={RouterLink} to={`/users/${userId}`} variant="text">
                Back to user
            </Button>

            <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                    Photo {currentIndex + 1} of {totalPhotos}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                    {formatDate(photo.date_time)}
                </Typography>
                {/*i moved these up bc we might end up having a bunch of comments*/}
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
            </Stack>

            <PhotoCard photo={photo}/>
        </Stack>
    );
}

export default PhotoViewer;
