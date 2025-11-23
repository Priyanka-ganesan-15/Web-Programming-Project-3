import React from "react";
import {Box, Divider, ListItemButton, ListItemText, Skeleton} from "@mui/material";
import {Link} from "react-router-dom";

//i copied this in from that other file just to clean stuff up
function User({user, stats, advanced, loadingStats}) {

    const userStats = stats.get(user._id);
    const isLoadingThisUserStats = advanced && loadingStats && !userStats;
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
                        {isLoadingThisUserStats ? (
                            // Loading skeleton for stats
                            <>
                                <Skeleton variant="circular" width={24} height={24}/>
                                <Skeleton variant="circular" width={24} height={24}/>
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
                                        //TODO i need to fix the bubble links
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
