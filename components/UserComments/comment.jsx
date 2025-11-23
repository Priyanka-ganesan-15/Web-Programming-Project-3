// CommentItem.jsx
import React from "react";
import {Box, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const MAX_COMMENT_LENGTH = 120;

//i dont know why we are doing this but ok...
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
}

function getRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
}

function CommentItem({comment}) {
    const navigate = useNavigate();
    const text = comment.comment || "";
    const isLong = text.length > MAX_COMMENT_LENGTH;
    const displayText = truncateText(text, MAX_COMMENT_LENGTH);

    const goToPhoto = () => {
        navigate(`/photos/${comment.photo_owner_id}/${comment.photo_id}`);
    };

    return (
        <Box
            onClick={goToPhoto}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToPhoto();
                }
            }}
            aria-label={`View comment on photo ${comment.photo_file_name}`}
            sx={{
                display: "flex",
                gap: 2,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                    bgcolor: "#efefef",
                    transform: "translateX(4px)",
                },
                "&:focus-visible": {
                    outline: "2px solid #1976d2",
                    outlineOffset: "2px",
                },
            }}
        >
            <Box
                component="img"
                src={`/images/${comment.photo_file_name}`}
                alt={comment.photo_file_name}
                onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                }}
                sx={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1,
                    flexShrink: 0,
                }}
            />

            <Box sx={{flex: 1, minWidth: 0}}>
                <Typography
                    variant="body2"
                    sx={{mb: 0.5, fontWeight: 500}}
                    title={isLong ? text : undefined}
                >
                    {displayText}
                </Typography>

                <Typography variant="caption" color="textSecondary">
                    {comment.photo_file_name} • {getRelativeDate(comment.date_time)}
                </Typography>
            </Box>
        </Box>
    );
}

export default CommentItem;