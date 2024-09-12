import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Endpoint for the WP REST API
    withCredentials: false, // Adjust if you need authentication
});

export default {
    getChallenges() {
        return apiClient.get('/challenge');
    },
    getChallenge(id) {
        return apiClient.get(`/challenge/${id}`);
    },
};
