import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom/client';
import { Grid, Paper } from '@mui/material';
import {
  BrowserRouter, Route, Routes, useParams,
} from 'react-router-dom';

import './styles/main.css';
// Import mock setup - Remove this once you have implemented the actual API calls
// import './lib/mockSetup.js'; // DISABLED - Using real MongoDB backend now
import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import UserComments from './components/UserComments';
import { FeatureFlagsProvider } from './src/context/FeatureFlagsContext';

function UserDetailRoute() {
  const { userId } = useParams();
  // eslint-disable-next-line no-console
  console.log('UserDetailRoute: userId is:', userId);
  return <UserDetail userId={userId} />;
}

function UserPhotosRoute() {
  const { userId } = useParams();
  return <UserPhotos userId={userId} />;
}

function PhotoShare() {
  return (
    <BrowserRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                {/* Homepage route intentionally left blank per project instructions */}
                <Route path="/users/:userId/comments" element={<UserComments />} />
                <Route path="/users/:userId" element={<UserDetailRoute />} />
                <Route path="/photos/:userId" element={<UserPhotosRoute />} />
                <Route path="/photos/:userId/:photoId" element={<UserPhotosRoute />} />
                <Route path="/users" element={<UserList />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('photoshareapp'));
root.render(
  <FeatureFlagsProvider>
    <PhotoShare />
  </FeatureFlagsProvider>,
);
