import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  CircularProgress,
  Link,
} from '@mui/material';

import './styles.css';
import { useFeatureFlags } from '../../src/context/FeatureFlagsContext';

/**
 * UserPhotos
 * - Fetches photos for the userId from route params
 * - If advanced===false: renders all photos with comments (original view)
 * - If advanced===true: renders single photo view with Prev/Next navigation
 */
function UserPhotos() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const { advanced } = useFeatureFlags();

  // Toggle to true to use Express server
  const USE_SERVER = true;
  const BASE = USE_SERVER ? 'http://localhost:3001' : '';

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoNotFound, setPhotoNotFound] = useState(false);

  // Fetch photos on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const tryGet = (path) => axios.get(path);

    const primary = `${BASE}/photos/${userId}`;
    const fallback = `${BASE}/photosOfUser/${userId}`;

    // Try primary endpoint, fallback to alternate on 404.
    tryGet(primary)
      .catch((err) => {
        // If primary returns 404, try the fallback endpoint
        if (err && err.response && err.response.status === 404) {
          return tryGet(fallback);
        }
        // For other errors, rethrow to be handled below
        throw err;
      })
      .then((response) => {
        if (!mounted) return;
        if (response && response.data) {
          setPhotos(Array.isArray(response.data) ? response.data : response.data.photos || []);
        } else if (mounted) {
          setPhotos([]);
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Failed to fetch photos for user ${userId}:`, err);
        if (mounted) setError('Failed to load photos.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [BASE, userId]);

  // Handle advanced mode: navigate to first photo if needed
  useEffect(() => {
    if (advanced && photos.length > 0 && !photoId) {
      navigate(`/photos/${userId}/${photos[0]._id}`, { replace: true });
    }
  }, [advanced, photos, photoId, userId, navigate]);

  // Update current index when photoId changes
  useEffect(() => {
    if (photoId && photos.length > 0) {
      const index = photos.findIndex((p) => p._id === photoId);
      if (index !== -1) {
        setCurrentIndex(index);
        setPhotoNotFound(false);
      } else {
        // Photo not found, use first photo
        setCurrentIndex(0);
        setPhotoNotFound(true);
      }
    } else if (!photoId) {
      setPhotoNotFound(false);
    }
  }, [photoId, photos]);

  // Helper: format date safely
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString();
    } catch (e) {
      return dateStr;
    }
  };

  // Helper: commenter initials for Avatar
  const initials = (user) => {
    if (!user) return '?';
    const first = user.first_name || '';
    const last = user.last_name || '';
    const f = first.charAt(0) || '';
    const l = last.charAt(0) || '';
    return `${f}${l}`.toUpperCase();
  };

  // Handler for Prev button
  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevPhoto = photos[currentIndex - 1];
      navigate(`/photos/${userId}/${prevPhoto._id}`, { replace: false });
    }
  };

  // Handler for Next button
  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      const nextPhoto = photos[currentIndex + 1];
      navigate(`/photos/${userId}/${nextPhoto._id}`, { replace: false });
    }
  };

  if (loading) {
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
        <Typography color="error" variant="body2">{error}</Typography>
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

  // Advanced mode: single photo view
  if (advanced) {
    const currentPhoto = photos[currentIndex];

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
          {currentPhoto.file_name && (
            <CardMedia
              component="img"
              image={`/images/${currentPhoto.file_name}`}
              alt={currentPhoto.file_name}
              sx={{ maxHeight: 500, objectFit: 'contain' }}
            />
          )}

          <CardContent>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Photo {currentIndex + 1} of {photos.length}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {formatDate(currentPhoto.date_time)}
              </Typography>

              {/* Navigation buttons */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  Prev
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleNext}
                  disabled={currentIndex === photos.length - 1}
                >
                  Next
                </Button>
              </Stack>

              <Divider />

              <Box>
                <Typography variant="subtitle2">Comments</Typography>

                {!currentPhoto.comments || currentPhoto.comments.length === 0 ? (
                  <Typography variant="body2">No comments yet.</Typography>
                ) : (
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    {currentPhoto.comments.map((comment) => (
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

  // Normal mode: multi-photo view (original behavior)
  return (
    <Stack spacing={2} sx={{ p: 1 }}>
      <Button component={RouterLink} to={`/users/${userId}`} variant="text">
        Back to user
      </Button>

      {photos.map((photo) => (
        <Card key={photo._id}>
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
      ))}
    </Stack>
  );
}

export default UserPhotos;
