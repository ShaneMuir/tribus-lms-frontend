import { ref, computed, readonly } from 'vue';

const token = ref(localStorage.getItem('token') || null);
const user = ref(JSON.parse(localStorage.getItem('user')) || null);

export default () => {
    const isUserSet = computed(() => user.value !== null);

    const setUser = (userData) => {
        user.value = {
            ...userData,
            score: userData.score || 0
        };
        localStorage.setItem('user', JSON.stringify(user.value));
    };

    const setToken = (userToken) => {
        token.value = userToken;
        localStorage.setItem('token', userToken);
    };

    const getUserScore = computed(() => {
        return user.value ? user.value.score : 0;
    });

    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return {
        isUserSet,
        user: readonly(user),
        token: readonly(token),
        setUser,
        setToken,
        getUserScore,
        logout,
    };
};
