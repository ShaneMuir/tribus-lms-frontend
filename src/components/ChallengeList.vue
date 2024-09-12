<template>
  <div>
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
        <router-link
            :to="{ name: 'ChallengeDetails', params: { id: challenge.id } }"
            class="btn btn-primary"
        >
          Go to Challenge
        </router-link>
      </div>
    </div>
    <div v-else>
      <p>No challenges available.</p>
    </div>
  </div>
</template>

<script>
import ChallengeService from "../services/ChallengeService.js";

export default {
  name: "ChallengeList",
  data() {
    return {
      challenges: [], // Initialize challenges as an empty array
    };
  },
  mounted() {
    ChallengeService.getChallenges()
        .then((response) => {
          this.challenges = response.data; // Fetch and assign the challenges
        })
        .catch((error) => {
          console.error("Error fetching challenges:", error);
        });
  },
};
</script>
