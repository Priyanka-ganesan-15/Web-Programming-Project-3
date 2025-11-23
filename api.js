import axios from "axios";
import {useMutation, useQuery} from '@tanstack/react-query';

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
        mutationFn: async (loginName) => {
            console.log(loginName);
            const res = await api.post('/admin/login', {login_name: loginName}, {withCredentials: true});
            return res.data; // expected: user object
        },
    });
};

export const postLogout = () => {
    return useMutation({
        mutationFn: async () => {
            const res = await api.post('/admin/logout', {}, {withCredentials: true});
            return res.data; // expected: user object
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


export default api;
