<script setup>
import {onMounted, ref} from 'vue';
import ChallengeService from "../services/ChallengeService.js";
import useUser from '@/composables/useUser.js';

const { isChallengeCompleted } = useUser();
const challenges = ref([]);

// TODO Split challenges into catgories: easy, medium, hard.
// TODO Paginate results


onMounted(async () => {
  try {
    const response = await ChallengeService.getChallenges();
    challenges.value = response.data;
  } catch (error) {
    console.error("Error fetching challenges:", error);
  }
});
</script>

<template>
  <div id="challengeList">
    <h1>Challenge List</h1>
    <div v-if="challenges.length">
      <div
          v-for="challenge in challenges"
          :key="challenge.id"
          class="challenge-item"
      >
        <div class="flex-wrapper">
          <div class="wrapper">
            <h2 v-if="challenge.title && challenge.title.rendered">
              {{ challenge.title.rendered }}
            </h2>
            <div v-if="challenge.content && challenge.content.rendered" v-html="challenge.content.rendered"></div>
          </div>

          <span v-if="isChallengeCompleted(challenge.id)" class="badge">Completed</span>
        </div>

        <div class="btn-container">
          <RouterLink
              :to="{ name: 'ChallengeDetails', params: { id: challenge.id } }"
              class="challenge-link"
          >
            Go to Challenge
          </RouterLink>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No challenges available.</p>
    </div>
  </div>
</template>

<style scoped>
  #challengeList {
    max-width: 800px;
    margin: auto;
  }

  h1 {
    margin-bottom: 1rem;
  }

  .btn-container {
    margin-top: 1rem;
  }

  /* Styling for Challenge Items */
  .challenge-item {
    border: 2px solid #fafafa;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.05); /* Very light transparent background */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth animation */
  }

  .challenge-link {
    padding: 12px;
    background-color: var(--tribus-blue, #1E00FF);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
    display: inline-block;
    text-decoration: none;
  }

  .challenge-link:hover {
    background-color: rgba(30, 0, 255, 0.8); /* Darken manually by adjusting RGBA */
  }

  /* Hover effect for challenge items */
  .challenge-item:hover {
    transform: translateY(-2px); /* Slight lift on hover */
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5); /* Add depth */
  }

  .badge {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.2rem 0.6rem;
    background-color: #28a745;
    color: white;
    border-radius: 12px;
    font-size: 0.85rem;
    text-transform: uppercase;
  }

  .flex-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
