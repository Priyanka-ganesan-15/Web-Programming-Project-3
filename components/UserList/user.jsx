import React from "react";
import {Box, Divider, ListItemButton, ListItemText, Skeleton} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {fetchUserStats} from "../../api";
import appStore from "../../src/context/appStore.js";

function User({user}) {
    const {data: userStats, isLoading: isLoadingStats} = fetchUserStats(user._id);
    const navigate = useNavigate();
    const advanced = appStore((s) => s.advanced);

    return (
        <>
            <ListItemButton
                component={Link}
                to={`/users/${user._id}`}
                sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
            >
                <ListItemText primary={`${user.first_name} ${user.last_name}`}/>

                {advanced && (
                    <Box sx={{display: 'flex', gap: 0.5, ml: 1}}>
                        {isLoadingStats ? (
                            <>
                                <Skeleton variant="circular" width={24} height={24}/>
                                <Skeleton variant="circular" width={24} height={24}/>
                            </>
                        ) : userStats ? (
                            <>
                                <span
                                    className="bubble green"
                                    role="status"
                                    aria-label={`${userStats.photoCount} photo${userStats.photoCount !== 1 ? 's' : ''}`}
                                >
                                    {userStats.photoCount}
                                </span>

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
            <Divider/>
        </>

    );
}

export default User;