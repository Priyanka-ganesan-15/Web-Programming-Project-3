import React from "react";
import {Box, Divider, ListItemButton, ListItemText, Skeleton} from "@mui/material";
import {Link, NavLink} from "react-router-dom";

//i copied this in from that other file just to clean stuff up
function User({user, stats, advanced, loadingStats}) {

    const userStats = stats.get(user._id);
    const isLoadingThisUserStats = advanced && loadingStats && !userStats;
    return (
        <>
            <ListItemButton // TODO a cannot be child of a
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
                                <div
                                    style={{
                                        display: "inline-block",
                                        minWidth: "18px",
                                        padding: "2px 6px",
                                        borderRadius: "999px",
                                        fontSize: "12px",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        border: "none",
                                        outline: "none",
                                        background: "#e6f6e6",
                                        color: "#157f3b",
                                    }}
                                >
                                    {userStats.photoCount}
                                </div>

                                {/* Comment count badge - red, clickable button */}
                                <NavLink
                                    style={{
                                        display: "inline-block",
                                        minWidth: "18px",
                                        padding: "2px 6px",
                                        borderRadius: "999px",
                                        fontSize: "12px",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        border: "none",
                                        outline: "none",
                                        background: "#ffe6e6",
                                        color: "#b42318",
                                        cursor: "pointer",
                                        transition: "background-color 0.2s ease, outline 0.2s ease",
                                        textDecoration: "none", // optional: ensure NavLink doesn't underline
                                    }}
                                    to={`/users/${user._id}/comments`}
                                >
                                    {userStats.commentCount}
                                </NavLink>

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
