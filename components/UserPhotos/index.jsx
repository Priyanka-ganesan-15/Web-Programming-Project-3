import React, {useEffect} from 'react';
import {useParams, Link as RouterLink, useNavigate} from 'react-router-dom';
import {
    Typography,
    Stack,
    Box,
    Button,
    CircularProgress,
} from '@mui/material';
import {getPhotos} from "../../api.js";
import PhotoCard from './photoCard';
import PhotoViewer from './photoViewer';
import appStore from "../../src/context/appStore.js";

function UserPhotos() {
    const {userId, photoId} = useParams();
    const navigate = useNavigate();

    const advanced = appStore((s) => s.advanced);
    const setPage = appStore((s) => s.setPage);
    const photoIndex = appStore((s) => s.photoIndex);
    const setPhotoIndex = appStore((s) => s.setPhotoIndex);

    const {data: photos = [], isLoading, error} = getPhotos(userId);

    // Handle advanced mode: navigate to first photo if needed
    useEffect(() => {
        if (advanced && photos.length > 0 && !photoId) {
            navigate(`/photos/${userId}/${photos[0]._id}`, {replace: true});
        }
    }, [advanced, photos, photoId, userId, navigate]);

    // Update current index when photoId changes
    useEffect(() => {
        setPage('Photos');
        if (photoId && photos.length > 0) {
            const idx = photos.findIndex((p) => p._id === photoId);
            setPhotoIndex(idx); // -1 if not found
        } else {
            setPhotoIndex(-1);
        }
    }, [photoId, photos, setPage]);

    // Photo stepper
    const handleNavigate = (direction) => {
        const newIndex = photoIndex + direction;
        if (newIndex < 0 || newIndex >= photos.length) return;

        const nextPhoto = photos[newIndex];
        navigate(`/photos/${userId}/${nextPhoto._id}`, {replace: false});
    };

    if (isLoading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" p={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={20}/>
                    <Typography variant="body2">Loading photos…</Typography>
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

    if (!photos || photos.length === 0) {
        return (
            <Box p={2}>
                <Button component={RouterLink} to={`/users/${userId}`} variant="text" sx={{mb: 1}}>
                    Back to user
                </Button>
                <Typography variant="body1">No photos to display.</Typography>
            </Box>
        );
    }

    // Advanced mode
    if (advanced) {
        if (photoIndex === -1) {
            return (
                <Box p={2}>
                    <Button component={RouterLink} to={`/users/${userId}`} variant="text">
                        Back to user
                    </Button>
                    <Typography variant="body1">Photo not found.</Typography>
                </Box>
            );
        }

        const currentPhoto = photos[photoIndex];
        return (
            <PhotoViewer
                photo={currentPhoto}
                currentIndex={photoIndex}
                totalPhotos={photos.length}
                userId={userId}
                stepper={handleNavigate}
            />
        );
    }

    // Normal mode
    return (
        <Stack spacing={2} sx={{p: 1}}>
            <Button component={RouterLink} to={`/users/${userId}`} variant="text">
                Back to user
            </Button>

            {photos.map((photo) => (
                <PhotoCard key={photo._id} photo={photo}/>
            ))}
        </Stack>
    );
}

export default UserPhotos;
