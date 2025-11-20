import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';

import './styles.css';
import './bubbles.css';
import { useFeatureFlags } from '../../src/context/FeatureFlagsContext';

// Toggle to true to use Express server
const USE_SERVER = true;
const BASE = USE_SERVER ? 'http://localhost:3001' : '';

/**
 * Helper function to fetch stats for a list of users
 * Fetches only users not already in cache
 * Returns updated Map with new stats
 */
const fetchUserStats = async (userList, existingStatsMap, baseUrl) => {
  const statsMap = new Map(existingStatsMap);
  const usersToFetch = userList.filter((user) => !statsMap.has(user._id));

  if (usersToFetch.length === 0) {
    // eslint-disable-next-line no-console
    console.log('✓ All user stats already cached, no fetch needed');
    return statsMap;
  }

  // eslint-disable-next-line no-console
  console.log(`→ Fetching stats for ${usersToFetch.length} user(s):`, usersToFetch.map((u) => `${u.first_name} ${u.last_name}`));

  const statPromises = usersToFetch.map((user) => (
    axios.get(`${baseUrl}/user/${user._id}/stats`)
      .then((statsRes) => {
        // eslint-disable-next-line no-console
        console.log(`✓ Cached stats for ${user.first_name} ${user.last_name}:`, statsRes.data);
        statsMap.set(user._id, statsRes.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(`✗ Failed to fetch stats for ${user.first_name} ${user.last_name}:`, error.message);
        statsMap.set(user._id, { photoCount: 0, commentCount: 0 });
      })
  ));

  await Promise.all(statPromises);
  return statsMap;
};

/**
 * UserList
 * - Fetches the user list from /user/list
 * - Displays each user as a clickable item linking to /users/:userId
 * - In advanced mode, shows stats badges (photo count, comment count)
 * - Uses Material-UI List for layout
 */
function UserList() {
  const { advanced } = useFeatureFlags();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState(new Map()); // Map of userId -> { photoCount, commentCount }

  useEffect(() => {
    let mounted = true;

    const url = `${BASE}/user/list`;
    // eslint-disable-next-line no-console
    console.log(`[UserList] Fetching users from: ${url}`);

    axios.get(url)
      .then(async (response) => {
        if (!mounted) return;
        const userList = response.data || [];
        // eslint-disable-next-line no-console
        console.log(`[UserList] Received ${userList.length} users from server`);
        setUsers(userList);

        // Fetch stats for users if in advanced mode
        if (advanced && userList.length > 0) {
          setLoadingStats(true);
          // eslint-disable-next-line no-console
          console.log(`[UserList] Advanced mode ON - checking stats cache for ${userList.length} user(s)`);
          const updatedStats = await fetchUserStats(userList, stats, BASE);
          if (mounted) {
            setStats(updatedStats);
            setLoadingStats(false);
          }
        } else if (!advanced) {
          // eslint-disable-next-line no-console
          console.log('[UserList] Advanced mode OFF - stats not fetched');
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch /user/list:', error);
        // eslint-disable-next-line no-console
        console.error('URL attempted:', url);
        // eslint-disable-next-line no-console
        console.error('Error details:', error.response?.status, error.response?.data, error.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [advanced]); // Re-run when advanced flag changes

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>

      {loading ? (
        <Typography variant="body2">Loading users...</Typography>
      ) : (
        <List component="nav" aria-label="user list">
          {users.length === 0 && (
            <Typography variant="body2">No users found.</Typography>
          )}

          {users.map((user) => {
            const userStats = stats.get(user._id);
            const isLoadingThisUserStats = advanced && loadingStats && !userStats;
            
            return (
              <React.Fragment key={user._id}>
                <ListItemButton
                  component={RouterLink}
                  to={`/users/${user._id}`}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <ListItemText primary={`${user.first_name} ${user.last_name}`} />

                  {advanced && (
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                      {isLoadingThisUserStats ? (
                        // Loading skeleton for stats
                        <>
                          <Skeleton variant="circular" width={24} height={24} />
                          <Skeleton variant="circular" width={24} height={24} />
                        </>
                      ) : userStats ? (
                        <>
                          {/* Photo count badge - green, read-only status */}
                          <span 
                            className="bubble green"
                            role="status"
                            aria-label={`${userStats.photoCount} photo${userStats.photoCount !== 1 ? 's' : ''}`}
                          >
                            {userStats.photoCount}
                          </span>

                          {/* Comment count badge - red, clickable button */}
                          <button
                            className="bubble red"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/users/${user._id}/comments`);
                            }}
                            aria-label={`View ${userStats.commentCount} comment${userStats.commentCount !== 1 ? 's' : ''} by ${user.first_name} ${user.last_name}`}
                            type="button"
                          >
                            {userStats.commentCount}
                          </button>
                        </>
                      ) : null}
                    </Box>
                  )}
                </ListItemButton>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
}

export default UserList;
