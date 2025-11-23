// UserList.jsx
import React from "react";
import {
    List,
    Typography,
    Box,
} from "@mui/material";
import "./styles.css";
import "./bubbles.css";
import User from "./user.jsx";
import {fetchUsers} from "../../api";

function UserList() {
    const {data: userList = [], isLoading, error} = fetchUsers();
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Users
            </Typography>

            {isLoading ? (
                <Typography variant="body2">Loading users...</Typography>
            ) : error ? (
                <Typography variant="body2">Error loading users: {error.message}</Typography>
            ) : (
                <List component="nav" aria-label="user list">
                    {userList.length === 0 && (
                        <Typography variant="body2">No users found.</Typography>
                    )}

                    {userList.map((user) => (
                        <User
                            user={user}
                            key={user._id}
                        />
                    ))}
                </List>
            )}
        </Box>
    );
}

export default UserList;