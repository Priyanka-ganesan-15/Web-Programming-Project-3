import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Alert, Box, Typography, Skeleton,
} from '@mui/material';
import { useFeatureFlags } from '../../src/context/FeatureFlagsContext';
import {fetchUserComments} from "../../api.js";

const MAX_COMMENT_LENGTH = 120;

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

function getRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function UserComments() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { advanced } = useFeatureFlags();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch comments for this user
        const commentsRes = await fetchUserComments(userId);
        setComments(commentsRes);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching comments:', err);
        setError(err.response?.data?.message || 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchComments();
    }
  }, [userId]);

  // If advanced features are OFF, show a message instead of redirecting
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

  if (loading) {
    return (
      <Box p={2}>
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
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
        <Alert severity="error">{error}</Alert>
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {comments.map((comment) => {
          const commentText = comment.comment || '';
          const isLongComment = commentText.length > MAX_COMMENT_LENGTH;
          const displayText = truncateText(commentText, MAX_COMMENT_LENGTH);

          return (
            <Box
              key={comment.comment_id}
              onClick={() => navigate(`/photos/${comment.photo_owner_id}/${comment.photo_id}`)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/photos/${comment.photo_owner_id}/${comment.photo_id}`);
                }
              }}
              aria-label={`View comment on photo ${comment.photo_file_name}`}
              sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#efefef',
                  transform: 'translateX(4px)',
                },
                '&:focus-visible': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                },
              }}
            >
              {/* Photo Thumbnail */}
              <Box
                component="img"
                src={`/images/${comment.photo_file_name}`}
                alt={comment.photo_file_name}
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />

              {/* Comment Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 0.5, fontWeight: 500 }}
                  title={isLongComment ? commentText : undefined}
                >
                  {displayText}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {comment.photo_file_name}
                  {' '}
                  •
                  {' '}
                  {getRelativeDate(comment.date_time)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default UserComments;
