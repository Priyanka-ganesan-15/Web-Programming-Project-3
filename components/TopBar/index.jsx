import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

import './styles.css';
import { useFeatureFlags } from '../../src/context/FeatureFlagsContext';

// Toggle this to true to hit the running Express server on localhost:3001
const USE_SERVER = false;
const BASE = USE_SERVER ? 'http://localhost:3001' : '';

/**
 * Parse the pathname and determine the view kind and userId (if any).
 * Returns { kind: 'list' | 'detail' | 'photos', userId: string | null }
 */
function parsePath(pathname) {
  const usersList = /^\/users\/?$/;
  const userDetail = /^\/users\/([^/]+)\/?$/;
  const photos = /^\/photos\/([^/]+)\/?$/;

  if (usersList.test(pathname) || pathname === '/') {
    return { kind: 'list', userId: null };
  }

  const mDetail = pathname.match(userDetail);
  if (mDetail) {
    return { kind: 'detail', userId: mDetail[1] };
  }

  const mPhotos = pathname.match(photos);
  if (mPhotos) {
    return { kind: 'photos', userId: mPhotos[1] };
  }

  return { kind: 'list', userId: null };
}

function TopBar() {
  const location = useLocation();
  const { kind, userId } = parsePath(location.pathname);
  const { advanced, setAdvanced } = useFeatureFlags();

  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Only fetch user when viewing detail or photos and a userId exists
    if ((kind === 'detail' || kind === 'photos') && userId) {
      setLoading(true);
      const url = `${BASE}/user/${userId}`;

      axios.get(url)
        .then((response) => {
          if (!mounted) return;
          const data = response.data || null;
          if (data && data.first_name && data.last_name) {
            setUserName(`${data.first_name} ${data.last_name}`);
          } else {
            setUserName('User');
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(`TopBar: failed to fetch user ${userId} from ${url}:`, err);
          if (mounted) setUserName('User');
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else {
      // Not a user-specific route — clear any previous name
      setUserName(null);
    }

    return () => {
      mounted = false;
    };
  }, [kind, userId]);

  // Determine the right-side title
  let title = 'Users';
  if (loading) {
    title = 'Loading...';
  } else if (kind === 'detail' && userName) {
    title = userName;
  } else if (kind === 'photos' && userName) {
    title = `Photos of ${userName}`;
  } else if (kind === 'list') {
    title = 'Users';
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">Priyanka Ganesan</Typography>
        </Box>

        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={advanced}
            onChange={(e) => setAdvanced(e.target.checked)}
            aria-label="Enable Advanced Features"
          />
          Enable Advanced Features
        </label>

        <Box>
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
