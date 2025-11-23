import axios from "axios";
import {useQuery} from '@tanstack/react-query';

const api = axios.create({
    baseURL: "http://localhost:3001",
});

export const fetchUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get("/user/list");
            return res.data;
        },
    });
};

export const fetchUserStats = (userId) => {
    return useQuery({
        queryKey: ['users', userId, 'stats'],
        queryFn: async () => {
            const res = await api.get(`/user/${userId}/stats`);
            return res.data;
        },
    });
};

export const fetchUserDetails = (userId) => {
    return useQuery({
        queryKey: ['users', userId, 'Details'],
        queryFn: async () => {
            const res = await api.get(`/user/${userId}`);
            return res.data;
        },
    });
};

export const fetchUserComments = (userId) => {
    return useQuery({
        queryKey: ['users', userId, 'Comments'],
        queryFn: async () => {
            const res = await api.get(`/commentsOfUser/${userId}`);
            return res.data;
        },
    });
};

export const getPhotos = (userId) => {
    return useQuery({
        queryKey: ['users', userId, 'Photos'],
        queryFn: async () => {
            const res = await api.get(`/photosOfUser/${userId}`);
            return res.data;
        },
    });
};

//used in top bar for some reason, best not to question the methodology...
export const fetchRoot = async () => {
    return axios.get('/');
};


export default api;
