<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import useUser from '../composables/useUser'; // Import the user composable

const username = ref('');
const password = ref('');

const { setUser, setToken } = useUser(); // Destructure the methods from the user composable

const login = async () => {
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

    alert('Login successful!'); // do more here...

  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert('Invalid username or password');
    } else {
      alert('Login failed: ' + error.response.data.message);
    }
    console.log(error);
  }
};
</script>
