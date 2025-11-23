import React, {useState} from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Divider,
    Stack,
    Box,
    TextField,
    Button
} from '@mui/material';
import {useQueryClient} from '@tanstack/react-query';
import {formatDate} from "./photoHelpers";
import PhotoComments from "./photoComments";
import {postComment} from "../../api.js";


function PhotoCard({photo}) {
    const [newComment, setNewComment] = useState(""); // again local state im sure this is fine?
    const addComment = postComment();
    const queryClient = useQueryClient();

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        addComment.mutate(
            {
                photoId: photo._id,
                commentContent: newComment
            },
            {
                onSuccess: () => {
                    setNewComment("");
                    queryClient.invalidateQueries(['photos', photo._id]);
                },
            }
        );
    };

    return (
        <Card>
            {photo.file_name && (
                <CardMedia
                    component="img"
                    image={`/images/${photo.file_name}`}
                    alt={photo.file_name}
                    sx={{maxHeight: 500, objectFit: 'contain'}}
                />
            )}

            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(photo.date_time)}
                    </Typography>

                    <Divider/>

                    <Box>
                        <Typography variant="subtitle2">Comments</Typography>
                        <PhotoComments comments={photo.comments}/>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            variant="contained"
                            onClick={handleAddComment}
                        >
                            Comment
                        </Button>

                        <TextField
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                    </Stack>

                </Stack>
            </CardContent>
        </Card>
    );
}

export default PhotoCard;
