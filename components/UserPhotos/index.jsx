import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Typography,
  Stack,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';

import './styles.css';
import { useFeatureFlags } from '../../src/context/FeatureFlagsContext';
import { getPhotos } from "../../api.js";
import PhotoCard from './photoCard';
import PhotoViewer from './photoViewer';

function UserPhotos() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const { advanced } = useFeatureFlags();

  const { data: photos = [], isLoading, error } = getPhotos(userId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoNotFound, setPhotoNotFound] = useState(false);

  // Handle advanced mode: navigate to first photo if needed
  useEffect(() => {
    if (advanced && photos.length > 0 && !photoId) {
      navigate(`/photos/${userId}/${photos[0]._id}`, { replace: true });
    }
  }, [advanced, photos, photoId, userId, navigate]);

  // Update current index when photoId changes
  useEffect(() => {
    if (photoId && photos.length > 0) {
      const phot = photos.findIndex((p) => p._id === photoId);
      if (phot !== -1) {
        setCurrentIndex(phot);
        setPhotoNotFound(false);
      } else {
        setCurrentIndex(0);
        setPhotoNotFound(true);
      }
    } else if (!photoId) {
      setPhotoNotFound(false);
    }
  }, [photoId, photos]);

  // young stepper
  const handleNavigate = (direction) => {
    const newIndex = currentIndex + direction;

    // prevent going out of bounds
    if (newIndex < 0 || newIndex >= photos.length) return;

    const nextPhoto = photos[newIndex];
    navigate(`/photos/${userId}/${nextPhoto._id}`, { replace: false });
  };

  if (isLoading) {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" p={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={20} />
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
          <Button component={RouterLink} to={`/users/${userId}`} variant="text" sx={{ mb: 1 }}>
            Back to user
          </Button>
          <Typography variant="body1">No photos to display.</Typography>
        </Box>
    );
  }

  // advanced mode
  if (advanced) {
    const currentPhoto = photos[currentIndex];
    return (
        <PhotoViewer
            photo={currentPhoto}
            currentIndex={currentIndex}
            totalPhotos={photos.length}
            userId={userId}
            photoNotFound={photoNotFound}
            stepper={handleNavigate}
        />
    );
  }

  // normal mode
  return (
      <Stack spacing={2} sx={{ p: 1 }}>
        <Button component={RouterLink} to={`/users/${userId}`} variant="text">
          Back to user
        </Button>

        {photos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} />
        ))}
      </Stack>
  );
}

export default UserPhotos;
