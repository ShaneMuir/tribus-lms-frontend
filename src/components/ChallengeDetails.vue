<script setup>
import {ref, onMounted, computed} from 'vue';
import { useRoute } from 'vue-router';
import { Codemirror } from 'vue-codemirror';
import { php } from '@codemirror/lang-php';
import { dracula } from '@uiw/codemirror-theme-dracula';
import ChallengeService from '../services/ChallengeService.js';
import useUser from '@/composables/useUser.js';
import useChallenge from '@/composables/useChallenge.js';
import { toast } from "@/composables/useToast.js";

// Composition API & State
const route = useRoute();
const challengeId = Number(route.params.id);
const { token, isUserSet, fetchCompletedChallenges, completedChallenges } = useUser();
const { challenge, testCases, fetchChallenge } = useChallenge();
const code = ref('');
const testResults = ref([]);
const extensions = [php({ plain: true }), dracula];

const tryAgainMode = ref(false);
const isChallengeCompleted = computed(() => completedChallenges.value.includes(challengeId) && !tryAgainMode.value);
// Fetch Challenge and User Data on Mounted
onMounted(async () => {
  if (isUserSet.value) await fetchCompletedChallenges();
  await fetchChallenge(challengeId, code, testCases);
});

// Extract function name from user's code
const extractFunctionName = (userCode) => {
  const match = userCode.match(/function\s+(\w+)\s*\(/);
  return match ? match[1] : null;
};

// Toggle "Try Again" mode
const toggleTryAgain = () => {
  tryAgainMode.value = !tryAgainMode.value;
  testResults.value = [];
};

// Submit code function
const submitCode = async () => {
  testResults.value = []; // Reset test results
  const functionName = extractFunctionName(code.value);

  if (!functionName) {
    toast('No function name found in user code', { type: 'error' });
    return;
  }

  // Run test cases
  for (const testCase of testCases.value) {
    const inputArgs = testCase.input;
    const testCode = `
      ${code.value}
      echo ${functionName}(${inputArgs});
    `;

    const response = await ChallengeService.submitCode(testCode, testCase.output);
    const output = response.data.stdout?.trim() || '';

    testResults.value.push({
      input: testCase.input,
      expected: testCase.output,
      output,
      status: output === testCase.output ? 'Passed' : 'Failed',
    });
  }

  // Update progress if user is logged in
  if (isUserSet.value) {
    const updated = await ChallengeService.updateProgress(challengeId, token.value);
    if (updated && updated.message === 'This challenge has already been completed.') {
      toast(updated.message, { type: 'warning' });
    }
  }

  // Reset "Try Again" mode after submission
  if (tryAgainMode.value) {
    tryAgainMode.value = false;
  }
};
</script>

<template>
  <div v-if="challenge" class="challenge-page">
    <div class="left-section">
      <h1>{{ challenge.title.rendered }}</h1>
      <div v-html="challenge.content.rendered"></div>

      <div class="test-results">
        <h3>Test Case Results:</h3>
        <ul>
          <li v-for="(result, index) in testResults" :key="index">
            Test Case {{ index + 1 }}:
            <strong :class="['status-badge', result.status === 'Passed' ? 'status-passed' : 'status-failed']">
              {{ result.status }}
            </strong><br />
            Input: {{ result.input }}<br />
            Expected: {{ result.expected }}<br />
            Got: {{ result.output }}
          </li>
        </ul>
      </div>
    </div>

    <div class="right-section">
      <Codemirror v-model="code" :extensions="extensions" style="height: 400px; text-align: left;"></Codemirror>
      <button @click="submitCode" :disabled="isChallengeCompleted">Submit</button>
      <!-- Try Again button, only shown if challenge was previously completed -->
      <button v-if="isChallengeCompleted" @click="toggleTryAgain">Try Again</button>
    </div>
  </div>
</template>

<style scoped>
.challenge-page {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.left-section {
  flex: 40% 1 0;
  border: 2px solid #fafafa;
  padding: 20px;
  border-radius: 6px;
  max-height: 500px; /* Set a maximum height for the left section */
  overflow-y: auto; /* Enable scrolling if content overflows */
}

.right-section {
  border: 2px solid #fafafa;
  flex: 55% 1 0;
  padding: 20px;
  border-radius: 6px;
  max-height: 500px; /* Set a maximum height for the code editor */
  overflow-y: auto; /* Enable scrolling if content overflows */
}

/* Styling for the test results */
.test-results {
  margin-top: 20px;
  max-height: 340px;
  overflow-y: auto; /* Enable scrolling if content overflows */
}

.test-results ul {
  list-style: none;
  padding-left: 0;
}

.test-results li {
  background-color: #2c2c2c;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  color: #fafafa;
}

.status-badge {
  display: inline-block;
  padding: 2px 6px;
  font-size: 0.85rem;
  border-radius: 12px;
  color: white;
  text-transform: uppercase;
  margin-left: 5px;
}

.status-passed {
  background-color: #28a745;
}

.status-failed {
  background-color: #dc3545;
}

.test-results h3 {
  margin-bottom: .5rem;
}
</style>
