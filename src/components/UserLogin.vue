<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import useUser from '@/composables/useUser';
import { toast } from "@/composables/useToast.js";
import useLoading from "@/composables/useLoading.js";

const username = ref('');
const password = ref('');

const { setUser, setToken } = useUser();
const { isLoading, startLoading, stopLoading } = useLoading();
const router = useRouter();

const login = async () => {
  startLoading();
  try {
    const response = await axios.post('https://tribus-lms.test/wp-json/jwt-auth/v1/token', {
      username: username.value,
      password: password.value,
    });

    const token = response.data.token;

    // Now fetch the user's details
    const userResponse = await axios.get('https://tribus-lms.test/wp-json/wp/v2/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Update user and token in the composable
    setToken(token);
    setUser(userResponse.data);

    toast('Login Successful',
        {
          position: 'bottom-right',
          timeout: 5000,
          type: 'success',
          transition: 'slide',
        })

    // Redirect to the home page after successful login
    await router.replace({name: 'ChallengeList'});

  } catch (error) {
    if (error.response && error.response.status === 403) {
      toast('Invalid username or password',
          {
            position: 'bottom-right',
            timeout: 5000,
            type: 'danger',
            transition: 'slide',
          });
    } else {
      toast('Login failed: ' + error.response.data.message,
          {
            position: 'bottom-right',
            timeout: 5000,
            type: 'danger',
            transition: 'slide',
          });
    }
    console.log(error);
  } finally {
    stopLoading();
  }
};
</script>

<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="isLoading">Login</button>
    </form>

    <p class="register-link">
      Don't have an account?
      <RouterLink :to="{ name: 'UserRegister' }" class="register-button">Register</RouterLink>
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

.register-link {
  margin-top: 1rem;

  a {
    color: var(--tribus-blue, #1E00FF);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
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
</style>
