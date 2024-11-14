import { ref } from 'vue';
import ChallengeService from "@/services/ChallengeService.js";

export default function useChallenge() {
    const challenge = ref(null);
    const testCases = ref([]);

    const fetchChallenge = async (challengeId, code, testCases) => {
        try {
            const response = await ChallengeService.getChallenge(challengeId);
            challenge.value = response.data;
            code.value = response.data.meta._tribus_starter_code || '';
            testCases.value = response.data.meta._tribus_test_cases || [];
        } catch (error) {
            console.error("Error fetching challenge:", error);
        }
    };

    return {
        challenge,
        testCases,
        fetchChallenge,
    };
}