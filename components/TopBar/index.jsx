import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

import './styles.css';
import appStore from "../../src/context/appStore.js";

function TopBar() {
    const advanced = appStore((s) => s.advanced);
    const setAdvanced = appStore((s) => s.setAdvanced);
    const page = appStore((s) => s.page);

    return (
        <AppBar className="topbar-appBar" position="absolute">
            <Toolbar style={{ justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h6">Current App</Typography> {/* Left-hand title */}
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
                    <Typography variant="subtitle1">{page}</Typography> {/* Right-hand title */}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
