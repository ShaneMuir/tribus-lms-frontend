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
import Modal from '@/components/Modal.vue';

// TODO add loading state when test results are pending/running
// TODO add completed badge if challenge has already been completed
// TODO add toasts when challenge is already completed to tell user no points are added.
// TODO add more challenges to the backend and do more testing

// Composition API & State
const route = useRoute();
const challengeId = Number(route.params.id);
const { token, isUserSet, completedChallenges, updateUserProgress } = useUser();
const { challenge, testCases, fetchChallenge } = useChallenge();
const code = ref('');
const testResults = ref([]);
const extensions = [php({ plain: true }), dracula];

const isLoadingTests = ref(false); // Add a loading state

const tryAgainMode = ref(false);
const isChallengeCompleted = computed(() => {
  return isUserSet.value && completedChallenges.value.includes(challengeId) && !tryAgainMode.value;
});

// Modal state
const showModal = ref(false);
const modalGif = ref('');
const modalMessage = ref('');

// Fetch Challenge and User Data on Mounted
onMounted(async () => {
  await fetchChallenge(challengeId, code, testCases);
});

// Extract function name from user's code
const extractFunctionName = (userCode) => {
  const match = userCode.match(/function\s+(\w+)\s*\(/);
  return match ? match[1] : null;
};

const userCodeBackup = ref(''); // Temporary backup for the user's code

// Toggle "Try Again" mode
const toggleTryAgain = () => {
  if (!tryAgainMode.value) {
    // Entering "Try Again" mode: save the current code
    userCodeBackup.value = code.value;
  } else {
    // Exiting "Try Again" mode: restore the backup code if available
    code.value = userCodeBackup.value || challenge.value?.meta?._tribus_starter_code || '';
  }

  tryAgainMode.value = !tryAgainMode.value;
  testResults.value = [];
};

// Reset CodeMirror editor explicitly
const resetCode = () => {
  code.value = challenge.value?.meta?._tribus_starter_code || '';
  userCodeBackup.value = ''; // Clear backup as user explicitly resets
};

// Submit code function
const submitCode = async () => {
  testResults.value = []; // Reset test results
  const functionName = extractFunctionName(code.value);

  isLoadingTests.value = true; // Set loading state to true

  if (!functionName) {
    toast('No function name found in user code', { type: 'error' });
    return;
  }

  let allTestsPassed = true;

  // Run test cases
  for (const testCase of testCases.value) {
    const inputArgs = testCase.input;
    const testCode = `
      ${code.value}
      echo ${functionName}(${inputArgs});
    `;

    const response = await ChallengeService.submitCode(testCode, testCase.output);
    const output = response.data.stdout?.trim() || '';

    const passed = output === testCase.output;

    testResults.value.push({
      input: testCase.input,
      expected: testCase.output,
      output,
      status: output === testCase.output ? 'Passed' : 'Failed',
    });

    if (!passed) {
      allTestsPassed = false;
    }
  }

  modalGif.value = allTestsPassed
      ? 'https://i.pinimg.com/originals/64/45/ee/6445ee2274a782a7c528303e9bd823d7.gif'
      : 'https://i.gifer.com/XZ9.gif';
  modalMessage.value = allTestsPassed
      ? 'Congratulations! You completed the challenge successfully!'
      : 'Oops! Some test cases failed. Try again!';
  showModal.value = true;

  if (isUserSet.value && token.value && allTestsPassed) {
    try {
      const serverResponse = await ChallengeService.updateProgress(challengeId, token.value);

      if (serverResponse) {
        if (serverResponse.message === 'This challenge has already been completed.') {
          toast(serverResponse.message, { type: 'warning' });
        } else if (serverResponse.new_score !== undefined) {
          updateUserProgress(challengeId, serverResponse.new_score);
          toast(`Progress updated successfully, ${serverResponse.score} points added!`, { type: 'success' });
        }
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
      toast('An error occurred while updating progress. Please try again.', { type: 'error' });
    }
  } else if (!isUserSet.value || !token.value) {
    toast('You need to log in to update your progress.', { type: 'warning' });
  }

  // Reset "Try Again" mode after submission
  if (tryAgainMode.value) {
    tryAgainMode.value = false;
  }

  isLoadingTests.value = false; // Set loading state to false
};
</script>

<template>
  <div v-if="challenge" class="challenge-page">
    <div class="left-section">
      <h1>{{ challenge.title.rendered }}</h1>
      <div v-html="challenge.content.rendered"></div>

      <div class="test-results">
        <h3>Test Case Results:</h3>
        <div v-if="isLoadingTests" class="loading-state">
          <p>Running tests, please wait...</p>
        </div>
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
      <button v-if="isChallengeCompleted" @click="toggleTryAgain">
        {{ tryAgainMode ? "Cancel Try Again" : "Try Again" }}
      </button>
      <button @click="resetCode" v-if="tryAgainMode">Reset Code</button>
    </div>
  </div>

  <Modal :visible="showModal" :gif="modalGif" :message="modalMessage" @close="showModal = false" />
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
