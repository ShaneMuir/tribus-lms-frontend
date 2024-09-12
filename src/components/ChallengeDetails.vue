<template>
  <div v-if="challenge">
    <h1>{{ challenge.title.rendered }}</h1>
    <div v-html="challenge.content.rendered"></div>

    <!-- CodeMirror Integration -->
    <Codemirror
        v-model="code"
        :extensions="extensions"
        style="height: 400px; text-align: left;"
    ></Codemirror>

    <button @click="submitCode">Submit</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Codemirror } from 'vue-codemirror';
import { php } from '@codemirror/lang-php';
import { dracula } from '@uiw/codemirror-theme-dracula';
import ChallengeService from '../services/ChallengeService.js';

import axios from 'axios';

const testCases = [
  { input: '2 3', expectedOutput: '5' }, // Test case 1: Sum of 2 + 3
  { input: '10 20', expectedOutput: '30' }, // Test case 2: Sum of 10 + 20
];

// Reactive state for the challenge and code editor
const challenge = ref(null);
const code = ref('function calc($a, $b) {\n  # Write your code here... \n}');

// Get the route object
const route = useRoute();

// Codemirror extensions for PHP and Dracula theme
const extensions = [php({ plain: true }), dracula];

// Fetch challenge data when the component is mounted
onMounted(() => {
  const challengeId = route.params.id; // Get the challenge ID from the route
  ChallengeService.getChallenge(challengeId)
      .then((response) => {
        challenge.value = response.data;
      })
      .catch((error) => {
        console.error('Error fetching challenge:', error);
      });
});

// Function to handle code submission
const submitCode = async () => {
  console.log('Code submitted:', code.value); //debugging

  for (const testCase of testCases) {
    const fullSourceCode = `${code.value}`;

    // Prepare the data for Judge0 API
    const submissionData = {
      source_code: fullSourceCode, // User's PHP code
      language_id: 68, // PHP language_id for Judge0
      stdin: '', // Optional, no need for stdin in this case
      expected_output: testCase.expectedOutput, // Expected output
    };

    const options = {
      method: 'POST',
      url: 'http://localhost:2358/submissions?base64_encoded=false&wait=true',
      headers: {
        'Content-Type': 'application/json',
      },
      data: submissionData,
    };

    try {
      // Send the request to the Judge0 API
      const response = await axios.request(options);

      // Capture output and check against expected output
      const output = response.data.stdout ? response.data.stdout.trim() : null;

      if (output === testCase.expectedOutput) {
        console.log(`Test case passed with input: ${testCase.input}`);
      } else {
        console.log(`Test case failed. Input: ${testCase.input}, Expected: ${testCase.expectedOutput}, Got: ${output}`);
      }
    } catch (error) {
      console.error('Error during code submission or execution:', error);
    }
  }
};
</script>

<style scoped>
button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369870;
}
</style>
