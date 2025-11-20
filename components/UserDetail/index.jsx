import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Box,
} from '@mui/material';

import './styles.css';

/**
 * UserDetail
 * - Reads :userId from the route via useParams()
 * - Fetches user data from /user/:userId (mock) or http://localhost:3001/user/:userId (server)
 * - Shows loading / error / not-found states
 */
function UserDetail() {
  // Read userId from the route params
  const { userId } = useParams();

  // Toggle to true to use Express server
  const USE_SERVER = true;
  const BASE = USE_SERVER ? 'http://localhost:3001' : '';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

  const url = `${BASE}/user/${userId}`;

    axios.get(url)
      .then((response) => {
        if (!mounted) return;
        // Expecting the API to return a user object or null
        setUser(response.data || null);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Failed to fetch user ${userId} from ${url}:`, err);
        if (mounted) setError('Failed to load user.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [BASE, userId]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" p={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2">Loading user…</Typography>
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

  if (!user) {
    return (
      <Box p={2}>
        <Typography variant="body1">User not found.</Typography>
        <Button component={RouterLink} to="/users" sx={{ mt: 1 }}>
          Back to users
        </Button>
      </Box>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <Card sx={{ p: 1 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">{fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.occupation}
          </Typography>
          <Typography variant="body1">{user.description}</Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              component={RouterLink}
              to={`/photos/${userId}`}
            >
              {`Photos of ${user.first_name}`}
            </Button>

            <Button variant="text" component={RouterLink} to="/users">
              Back to users
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
