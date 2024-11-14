<script setup>
import { computed, ref, onMounted } from 'vue';
import useUser from '@/composables/useUser';
import { vOnClickOutside } from '@vueuse/components';
import defaultAvatar from '@/assets/gravatar.png';

const { user, getUserScore, isUserSet, logout } = useUser();

const avatarSrc = computed(() => {
  return user.value?.avatar_urls?.[96] || defaultAvatar;
});

const rank = computed(() => {
  // We need to work out here how to going to do the ranking, we can use the rest api or create an endpoint to put all users scores in a object
  // then can do something with that maybe or is there a better way?
  // set to 1 for dev purposes...
  return user.value?.rank || 1; // Assuming the rank is in user object
});

const profileMenuVisible = ref(false);

const closeMenu = () => {
  profileMenuVisible.value = false;
}

const toggleProfileMenu = () => {
  profileMenuVisible.value = !profileMenuVisible.value;
}
</script>

<template>
  <!-- Header with user's rank/score and profile -->
  <header class="app-header">
    <div class="profile-section">
      <div class="profile-info">
        <div class="rank-wrapper">
          <p :class="{'gold-badge': rank === 1, 'silver-badge': rank === 2, 'bronze-badge': rank === 3}">
              Rank: <span>{{ rank }}</span>
          </p>
          <p style="font-weight: 900;">|</p>
          <p>Score: <span>{{ getUserScore }}</span></p>
        </div>

        <div class="profile-wrapper">
          <img :src="avatarSrc" alt="User Profile" class="profile-pic" @click="toggleProfileMenu"/>
        </div>
        <div v-if="profileMenuVisible" class="profile-dropdown" v-on-click-outside="closeMenu">
          <div v-if="isUserSet">
            <RouterLink :to="{name: 'UserProfile', params: { id: user.id } }">
              <font-awesome-icon :icon="['fas', 'user']" />
              Profile
            </RouterLink>

            <a href="/logout" @click.prevent="logout">
              <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
              Logout
            </a>
          </div>
          <div v-else>
            <RouterLink :to="{name: 'UserLogin' }">
              <font-awesome-icon :icon="['fas', 'user']" />
              Login
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Header styles */
.app-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.rank-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 1rem;
}

.profile-wrapper {
  border: 3px solid white;
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-section {
  display: flex;
  align-items: center;
}

.profile-info {
  display: flex;
  align-items: center;
}

.gold-badge {
  border: 1px solid gold;
  padding: 5px 10px;
  border-radius: 6px;
}

.silver-badge {
  border: 1px solid silver;
  padding: 5px 10px;
  border-radius: 6px;
}

.bronze-badge {
  border: 1px solid #cd7f32;
  padding: 5px 10px;
  border-radius: 6px;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.profile-dropdown {
  position: absolute;
  top: 80px;
  right: 20px;
  background-color: #1C1C1C;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-dropdown a {
  color: #fafafa;
  text-decoration: none;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-dropdown a:hover {
  color: var(--tribus-blue, #1E00FF);
}
</style>
