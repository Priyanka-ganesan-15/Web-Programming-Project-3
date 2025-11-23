import React, {useEffect, useState} from "react";
import {
    List,
    Typography,
    Box,
} from "@mui/material";
import "./styles.css";
import "./bubbles.css";
import {useFeatureFlags} from "../../src/context/FeatureFlagsContext";
import User from "./user.jsx";
import {fetchUsers, fetchUserStats} from "../../api";

//this is a kind of ugly way to handle this, if im feeling up to it i might dump this to user & rewrite the back end to
//work with that later
const statsFetcher = async (userList, existingStatsMap) => {
    const statsMap = new Map(existingStatsMap);
    const usersToFetch = userList.filter((user) => !statsMap.has(user._id));

    if (usersToFetch.length === 0) {
        console.log("✓ All user stats already cached, no fetch needed");
        return statsMap;
    }

    const statPromises = usersToFetch.map((user) =>
        fetchUserStats(user._id)
            .then((stats) => {
                console.log(
                    `✓ Cached stats for ${user.first_name} ${user.last_name}:`,
                    stats
                );
                statsMap.set(user._id, stats);
            })
            .catch((error) => {
                console.error(
                    `✗ Failed to fetch stats for ${user.first_name} ${user.last_name}:`,
                    error.message
                );
                statsMap.set(user._id, {photoCount: 0, commentCount: 0});
            })
    );

    await Promise.all(statPromises);
    return statsMap;
};

//actual componnent
function UserList() {
    const {advanced} = useFeatureFlags();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStats, setLoadingStats] = useState(false);
    const [stats, setStats] = useState(new Map()); // Map of userId -> { photoCount, commentCount }

    useEffect(() => {
        console.log("[UserList] Fetching users...");
        fetchUsers()
            .then(async (userList) => {
                setUsers(userList);
                if (advanced && userList.length > 0) {
                    setLoadingStats(true);
                    console.log(
                        `[UserList] Advanced mode ON - checking stats cache for ${userList.length} user(s)`
                    );
                    const updatedStats = await statsFetcher(userList, stats);
                    setStats(updatedStats);
                    setLoadingStats(false);
                } else if (!advanced) {
                    console.log("[UserList] Advanced mode OFF - stats not fetched");
                }
            })
            .catch((error) => {
                console.error("Failed to fetch user list:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [advanced]);

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
                        return <User
                            stats={stats}
                            user={user}
                            advanced={advanced}
                            loadingStats={loadingStats}
                            key={user._id}
                        />
                    })}
                </List>
            )}
        </Box>
    );
}

export default UserList;
