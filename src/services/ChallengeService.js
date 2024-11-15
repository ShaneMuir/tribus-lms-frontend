import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Endpoint for the WP REST API
    withCredentials: false, // Adjust if you need authentication
});

const judge0Client = axios.create({
    baseURL: 'http://localhost:2358',
    headers: { 'Content-Type': 'application/json' },
});

export default {
    getChallenges() {
        return apiClient.get('/challenge');
    },

    getChallenge(id) {
        return apiClient.get(`/challenge/${id}`);
    },

    async submitCode(sourceCode, expectedOutput) {
        return judge0Client.post('/submissions?base64_encoded=false&wait=true', {
            source_code: sourceCode,
            // TOOD add more language supports here, probably JS and Python but may be big job...
            language_id: 68, // PHP language ID for Judge0
            stdin: '',
            expected_output: expectedOutput,
        });
    },

    async updateProgress(challengeId, token) {
        try {
            const response = await apiClient.post('/custom/v1/progress', {
                challenge_id: challengeId,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating user progress:', error);
            return null;
        }
    },
};