import React from 'react';
import {AppBar, Toolbar, Typography, Box, Button} from '@mui/material';

import './styles.css';
import appStore from "../../src/context/appStore.js";
import {postLogout} from "../../api.js";

function TopBar() {
    const advanced = appStore((s) => s.advanced);
    const setAdvanced = appStore((s) => s.setAdvanced);
    const page = appStore((s) => s.page);
    const user = appStore((s) => s.loggedInUser);
    const logoutMutation = postLogout();
    const logoutUser = appStore((s) => s.logoutUser);

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                logoutUser();
            },
        });
    };

    return (
        <AppBar className="topbar-appBar" position="absolute">
            <Toolbar style={{justifyContent: 'space-between'}}>
                <Box>
                    {user ? (
                        <div style={{display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center'}}>
                            <Typography variant="h6">{user.first_name} {user.last_name}</Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleLogout}
                                disabled={logoutMutation.isLoading}
                            >
                                {logoutMutation.isLoading ? 'Logging out...' : 'Log Out'}
                            </Button>
                        </div>
                    ) : <Typography variant="h6">log in please :3c</Typography>}
                </Box>

                <label style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    <input
                        type="checkbox"
                        checked={advanced}
                        onChange={(e) => setAdvanced(e.target.checked)}
                        aria-label="Enable Advanced Features"
                    />
                    Enable Advanced Features
                </label>

                <Box>
                    <Typography variant="subtitle1">{page}</Typography> {/* Right-hand title */}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
