<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Codemirror } from 'vue-codemirror';
import { php } from '@codemirror/lang-php';
import { dracula } from '@uiw/codemirror-theme-dracula';
import ChallengeService from '../services/ChallengeService.js';
import useUser from '@/composables/useUser.js';
import axios from 'axios';
import {toast} from "@/composables/useToast.js";

const { token, isUserSet } = useUser();
const testCases = [];
const testResults = ref([]); // Holds the result of each test case
const completedChallenges = ref([]);

// Reactive state for the challenge and code editor
const challenge = ref(null);
const code = ref();
const route = useRoute();

// Fetch completed challenges when the component is mounted
if (isUserSet.value) {
  axios.get('https://tribus-lms.test/wp-json/wp/v2/users/me', {
    headers: { Authorization: `Bearer ${token.value}` },
  })
      .then((response) => {
        console.log(response.data);
        completedChallenges.value = response.data.completed_challenges || [];
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
}

// Codemirror extensions for PHP and Dracula theme
const extensions = [php({ plain: true }), dracula];

// Fetch challenge data when the component is mounted
onMounted(() => {
  const challengeId = route.params.id; // Get the challenge ID from the route
  ChallengeService.getChallenge(challengeId)
      .then((response) => {
        code.value = response.data.meta._tribus_starter_code;

        // Ensure test cases are pushed correctly
        const fetchedTestCases = response.data.meta._tribus_test_cases;
        if (Array.isArray(fetchedTestCases)) {
          testCases.push(...fetchedTestCases); // Spread the array into testCases
        }

        challenge.value = response.data;
      })
      .catch((error) => {
        console.error('Error fetching challenge:', error);
      });
});

// Function to extract function name from user's code
const extractFunctionName = (userCode) => {
  const functionNameMatch = userCode.match(/function\s+(\w+)\s*\(/);
  return functionNameMatch ? functionNameMatch[1] : null;
};

// Function to handle code submission
const submitCode = async () => {
  testResults.value = []; // Reset test results

  // Extract function name from user's code
  const functionName = extractFunctionName(code.value);

  if (!functionName) {
    console.error('No function name found in user code');
    return;
  }

  for (const testCase of testCases) {
    // Dynamically inject the function call with the test case input
    const inputArgs = testCase.input;
    const testCode = `
      ${code.value}
      echo ${functionName}(${inputArgs});
    `;

    console.log(testCode);

    // Prepare the data for Judge0 API
    const submissionData = {
      source_code: testCode, // User's PHP code + dynamic function call
      language_id: 68, // PHP language_id for Judge0
      stdin: '', // Optional, no need for stdin in this case
      expected_output: testCase.output, // Expected output
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
      const output = response.data.stdout ? response.data.stdout.trim() : null;

      // Add test case result
      testResults.value.push({
        input: testCase.input,
        expected: testCase.output,
        output: output,
        status: output === testCase.output ? 'Passed' : 'Failed',
      });

    } catch (error) {
      console.error('Error during code submission or execution:', error);
    }
  }

  // Update user progress if logged in
  if (isUserSet.value) {
    try {
      const updateResponse = await axios.post('https://tribus-lms.test/wp-json/custom/v1/progress', {
        challenge_id: route.params.id,
      }, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });

      if (updateResponse.data.message === 'This challenge has already been completed.') {
        // Show a message to the user
        toast(updateResponse.data.message,
            {
              position: 'bottom-right',
              timeout: 5000,
              type: 'danger',
              transition: 'slide',
            });
        return; // Disable submit button or return early
      }

      console.log('User progress updated:', updateResponse.data);
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }
};
</script>

<template>
  <div class="challenge-page"  v-if="challenge">
    <!-- Left section: Challenge info and test results -->
    <div class="left-section">
      <h1>{{ challenge.title.rendered }}</h1>
      <div v-html="challenge.content.rendered"></div>

      <!-- Test case results -->
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

    <!-- Right section: Code editor and submit button -->
    <div class="right-section">
      <!-- CodeMirror Integration -->
      <Codemirror
          v-model="code"
          :extensions="extensions"
          style="height: 400px; text-align: left;"
      ></Codemirror>

      <button @click="submitCode" :disabled="completedChallenges.includes(route.params.id)">Submit</button>
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
