import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001",
});

export const fetchUsers = async () => {
    const res = await api.get("/user/list");
    return res.data;
};

export const fetchUserStats = async (userId) => {
    const res = await api.get(`/user/${userId}/stats`);
    return res.data;
};

export const fetchUserDetails = async (userId) => {
    const res = await api.get(`/user/${userId}`);
    return res.data;
}

export const fetchUserComments = async (userId) => {
    console.log(`/commentsOfUser/${userId}`);
    const res = await api.get(`/commentsOfUser/${userId}`);
    return res.data;
}

export const fetchRoot = async()=>{
    return await axios.get('/');
}

export default api;
