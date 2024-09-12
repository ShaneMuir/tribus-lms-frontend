import { createRouter, createWebHistory } from 'vue-router';
import ChallengeList from '../components/ChallengeList.vue';
import ChallengeDetails from '../components/ChallengeDetails.vue';

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
];

const router = createRouter({
    history: createWebHistory(), // Removed BASE_URL as it's no longer needed
    routes,
});

export default router;
