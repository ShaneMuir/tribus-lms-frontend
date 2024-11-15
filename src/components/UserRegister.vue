<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import useUser from '@/composables/useUser';
import { toast } from "@/composables/useToast.js";
import useLoading from "@/composables/useLoading.js";

// TODO improve the ajax posts responses

const username = ref('');
const email = ref('');
const password = ref('');

const { setUser, setToken } = useUser();
const { isLoading, startLoading, stopLoading } = useLoading();
const router = useRouter();

const register = async () => {
  startLoading();
  try {
    const response = await axios.post('https://tribus-lms.test/wp-json/custom/v1/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    // Assuming the response contains a token and user details
    const token = response.data.token; // Adjust based on your actual response structure
    const userResponse = response.data.user; // Adjust based on your actual response structure

    // Update user and token in the composable
    setToken(token);
    setUser(userResponse);

    toast('Registration successful!',
        {
          position: 'bottom-right',
          timeout: 5000,
          type: 'success',
          transition: 'slide',
        });

    // Redirect to the home page after successful registration
    await router.replace({ name: 'ChallengeList' });

  } catch (error) {
    let errorMessage = 'Registration failed.';

    // Check for different error responses
    if (error.response) {
      // Server responded with a status code
      const { status, data } = error.response;

      if (status === 400) {
        // Bad request - possibly validation errors
        errorMessage = data.message || 'Please fill in all required fields.';
      } else if (status === 409) {
        // Conflict - user already exists
        errorMessage = 'User already exists. Please choose another username or email.';
        console.log('this one');
      } else if (status === 500) {
        // Server error
        errorMessage = 'Internal server error. Please try again later.';
      } else {
        errorMessage = data.message || 'An unexpected error occurred.';
      }
    } else if (error.request) {
      // No response received from the server
      errorMessage = 'No response from the server. Please check your connection.';
    } else {
      // Something else caused the error
      // errorMessage = error.message;
    }

    toast(errorMessage,
        {
          position: 'bottom-right',
          timeout: 5000,
          type: 'danger',
          transition: 'slide',
        });
  } finally {
    stopLoading();
  }
};
</script>

<template>
  <div class="container">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="isLoading">Register</button>
    </form>

    <p class="login-link">
      Already registered?
      <RouterLink :to="{ name: 'UserLogin' }" class="login-button">Login</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 2.5rem auto auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: rgba(200, 200, 200, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 1rem;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.5); /* Light border */
  border-radius: 4px;
  font-size: 1rem;
  color: white;
  transition: border-color 0.3s;
  background: rgba(255, 255, 255, 0.2); /* Slightly transparent input */
}

input:focus {
  border-color: var(--tribus-blue, #1E00FF);
  outline: none;
}

.login-link {
  margin-top: 1rem;

  a {
    color: var(--tribus-blue, #1E00FF);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
