import { createRouter, createWebHistory } from 'vue-router';
import ChallengeList from '../components/ChallengeList.vue';
import ChallengeDetails from '../components/ChallengeDetails.vue';
import UserLogin from '../components/UserLogin.vue';
import UserRegister from '../components/UserRegister.vue';
import useUser from "../composables/useUser.js";
import UserProfile from "../components/UserProfile.vue";
import { toast } from "../composables/useToast.js";

const routes = [
    {
        path: '/',
        name: 'ChallengeList',
        component: ChallengeList,
    },
    {
        path: '/challenge/:id',
        name: 'ChallengeDetails',
        component: ChallengeDetails,
        props: true, // Enables passing route params as props
    },
    {
        path: '/login/',
        name: 'UserLogin',
        component: UserLogin,
    },
    {
        path: '/register',
        name: 'UserRegister',
        component: UserRegister,
    },
    {
      path: '/profile/:id',
      name: 'UserProfile',
      component: UserProfile,
      props: true,
    },
];

const router = createRouter({
    history: createWebHistory(), // Removed BASE_URL as it's no longer needed
    routes,
});

export const initRouter = () => {
    const { getUser, isUserSet } = useUser();

    router.beforeEach(async (to, from, next) => {
        // Refresh user info if coming from an undefined route
        if (typeof from.name === 'undefined') {
            await getUser();
        }

        // Check if the route requires authentication
        if (to.name === 'UserProfile' && !isUserSet.value) {
            toast('Not logged in!',
                {
                    position: 'bottom-right',
                    timeout: 5000,
                    type: 'danger',
                    transition: 'slide',
                });
            // Redirect to login
            next({ name: 'UserLogin' });
        } else {
            next(); // Proceed to the route
        }
    });

    return router;
};

export default router;
