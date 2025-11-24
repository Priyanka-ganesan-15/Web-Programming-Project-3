import axios from "axios";
import {useMutation, useQuery} from '@tanstack/react-query';

//api relays from problem 1

const api = axios.create({
    baseURL: "http://localhost:3001",
});

export const fetchUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get("/user/list", {withCredentials: true});
            return res.data;
        },
    });
};

export const fetchUserStats = (userId) => {
    return useQuery({
        queryKey: ['users', userId, 'stats'],
        queryFn: async () => {
            const res = await api.get(`/user/${userId}/stats`, {withCredentials: true});
            return res.data;
        },
    });
};

export const fetchUserDetails = (userId) => {
    return useQuery({
        queryKey: ['users', userId, 'Details'],
        queryFn: async () => {
            const res = await api.get(`/user/${userId}`, {withCredentials: true});
            return res.data;
        },
    });
};

export const fetchUserComments = (userId) => {
    return useQuery({
        queryKey: ['users', userId, 'Comments'],
        queryFn: async () => {
            const res = await api.get(`/commentsOfUser/${userId}`, {withCredentials: true});
            return res.data;
        },
    });
};

export const getPhotos = (userId) => {
    return useQuery({
        queryKey: ['users', userId, 'Photos'],
        queryFn: async () => {
            const res = await api.get(`/photosOfUser/${userId}`, {withCredentials: true});
            return res.data;
        },
    });
};


export const postLogin = () => {
    return useMutation({
        mutationFn: async (loginObject) => {
            const res = await api.post('/admin/login', loginObject, {withCredentials: true});
            return res.data;
        },
    });
};

export const postRegister = () => {
    return useMutation({
        mutationFn: async (userObject) => {
            const res = await api.post('/user', userObject, {withCredentials: true});
            return res.data;
        },
    });
};

export const postLogout = () => {
    return useMutation({
        mutationFn: async () => {
            const res = await api.post('/admin/logout', {}, {withCredentials: true});
            return res.data;
        },
    });
};

export const postComment = () => {
    return useMutation({
        mutationFn: async ({photoId, commentContent}) => {
            const res = await api.post(`/commentsOfPhoto/${photoId}`, {comment: commentContent}, {withCredentials: true});
            return res.data;
        },
    });
};

export const postPhoto = () => {
    return useMutation({
        mutationFn: async (domForm) => {
            const res = await api.post('photos/new', domForm, {withCredentials: true});
            return res.data;
        }
    });
};
