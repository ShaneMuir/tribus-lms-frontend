import { ref, computed, readonly } from 'vue';
import { useLocalStorage } from "@vueuse/core";
import axios from "axios";
import router from "@/router/index.js";
import { toast } from "@/composables/useToast.js";

const token = useLocalStorage('token', null);
const user = ref(null);
const completedChallenges = ref([]);

export default () => {
    const isUserSet = computed(() => user.value !== null);

    const setUser = (userData) => {
        user.value = {
            ...userData,
            score: userData.score || 0
        };
    };

    const getUser = async () => {
        if (token.value) {
        try {
          const userResponse = await axios.get('https://tribus-lms.test/wp-json/wp/v2/users/me', {
            headers: { Authorization: `Bearer ${token.value}` },
          });
          setUser(userResponse.data);
          completedChallenges.value = (userResponse.data.completed_challenges || []).map(Number);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
      }
    }

    const fetchCompletedChallenges = async () => {
        await getUser();
    };

    const isChallengeCompleted = (challengeId) => {
        return completedChallenges.value.includes(challengeId);
    };

    const setToken = (userToken) => {
        token.value = userToken;
    };

    const getUserScore = computed(() => {
        return user.value ? user.value.score : 0;
    });

    const logout = () => {
        user.value = null;
        token.value = null;

        completedChallenges.value = null; // reset completedChallenges reactive on logout

        toast('Logout successful',
            {
                position: 'bottom-right',
                timeout: 4000,
                type: 'success',
                transition: 'slide',
            })

        // Check if the current route is the UserProfile route
        if (router.currentRoute.value.name === 'UserProfile') {
            // Redirect to login or another page
            router.push({ name: 'ChallengeList' });
        }
    };

    return {
        isUserSet,
        user: readonly(user),
        token: readonly(token),
        setUser,
        getUser,
        setToken,
        getUserScore,
        completedChallenges: readonly(completedChallenges),
        fetchCompletedChallenges,
        isChallengeCompleted,
        logout,
    };
};
