<script setup>
import { ref } from 'vue';
import ChallengeService from "../services/ChallengeService.js";

// Initialize challenges as a reactive variable
const challenges = ref([]);

// Fetch challenges on component mount
ChallengeService.getChallenges()
    .then((response) => {
      challenges.value = response.data; // Assign the fetched challenges to the reactive variable
    })
    .catch((error) => {
      console.error("Error fetching challenges:", error);
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
        <h2 v-if="challenge.title && challenge.title.rendered">
          {{ challenge.title.rendered }}
        </h2>
        <div v-if="challenge.content && challenge.content.rendered" v-html="challenge.content.rendered"></div>
        <RouterLink
            :to="{ name: 'ChallengeDetails', params: { id: challenge.id } }"
            class="btn btn-primary"
        >
          Go to Challenge
        </RouterLink>
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

  /* Styling for Challenge Items */
  .challenge-item {
    border: 2px solid #fafafa;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.05); /* Very light transparent background */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth animation */
  }

  /* Hover effect for challenge items */
  .challenge-item:hover {
    transform: translateY(-2px); /* Slight lift on hover */
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5); /* Add depth */
  }
</style>
