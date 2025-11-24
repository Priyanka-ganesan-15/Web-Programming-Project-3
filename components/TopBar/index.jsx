import React, {useRef} from 'react';
import {AppBar, Toolbar, Typography, Box, Button} from '@mui/material';

import './styles.css';
import {useQueryClient} from "@tanstack/react-query";
import appStore from "../../src/context/appStore.js";
import {postLogout, postPhoto} from "../../api.js";

function TopBar() {
    const advanced = appStore((s) => s.advanced);
    const setAdvanced = appStore((s) => s.setAdvanced);
    const page = appStore((s) => s.page);
    const user = appStore((s) => s.loggedInUser);
    const logoutMutation = postLogout();
    const logoutUser = appStore((s) => s.logoutUser);

    //this. was throwing error
    const fileInputRef = useRef(null);
    const queryClient = useQueryClient();
    const uploadMutation = postPhoto();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                logoutUser();
            },
        });
    };

    //slightly modified from sample code
    const handleUploadButtonClicked = (e) => {
        e.preventDefault();

        const files = fileInputRef.current.files;
        if (!files || files.length === 0) return;

        const domForm = new FormData();
        domForm.append("uploadedphoto", files[0]);

        console.log(files[0]);
        uploadMutation.mutate(domForm, {
            onSuccess: () => {
                console.log("Upload successful!");
                fileInputRef.current.value = "";
                queryClient.invalidateQueries(['users', user._id, 'stats']);
                queryClient.invalidateQueries(['users', user._id, 'Photos']);
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
                                Log Out
                            </Button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                            />
                            <Button
                                variant="contained"
                                color='secondary'
                                onClick={handleUploadButtonClicked}
                            >
                                Upload Photo
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
