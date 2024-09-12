<template>
  <div id="app">
    <!-- Header with user's rank/score and profile -->
    <header class="app-header">
      <div class="profile-section">
        <div class="profile-info">
          <span class="score-rank">Rank: 12 | Score: 3450</span>
          <img src="https://avatars.githubusercontent.com/u/37075817?s=100" alt="User Profile" class="profile-pic" @click="toggleProfileMenu" />
          <div v-if="profileMenuVisible" class="profile-dropdown">
            <a href="/profile">View Profile</a>
            <a href="/logout">Logout</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar with logo and challenge icon list -->
    <aside :class="['sidebar', { 'sidebar-expanded': sidebarExpanded }]" @mouseenter="expandSidebar" @mouseleave="collapseSidebar">
      <div class="logo-container">
        <!-- Company logo that links to the company website and opens in a new tab -->
        <a href="/" class="logo">
          <img src="/tribus-icon.png" alt="Tribus Icon">
          <span class="nav-text">Tribus</span>
        </a>
      </div>
      <nav class="sidebar-nav">
        <!-- Use Font Awesome icons in the nav links -->
        <a href="/" class="nav-link">
          <font-awesome-icon :icon="['fas', 'tasks']" />
          <span class="nav-text">Challenges</span>
        </a>
        <a href="/profile" class="nav-link">
          <font-awesome-icon :icon="['fas', 'user']" />
          <span class="nav-text">Profile</span>
        </a>
      </nav>
    </aside>

    <!-- Main content area for routing -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profileMenuVisible: false,
      sidebarExpanded: false, // Controls whether the sidebar is expanded or collapsed
    };
  },
  methods: {
    toggleProfileMenu() {
      this.profileMenuVisible = !this.profileMenuVisible;
    },
    expandSidebar() {
      this.sidebarExpanded = true;
    },
    collapseSidebar() {
      this.sidebarExpanded = false;
    }
  }
};
</script>

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

.profile-section {
  display: flex;
  align-items: center;
}

.profile-info {
  display: flex;
  align-items: center;
}

.score-rank {
  margin-right: 1rem;
  color: #fafafa;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.profile-dropdown {
  position: absolute;
  top: 75px;
  right: 15px;
  background-color: #1C1C1C;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-dropdown a {
  display: block;
  color: #fafafa;
  text-decoration: none;
  padding: 0.5rem 0;
}

.profile-dropdown a:hover {
  color: var(--tribus-blue, #1E00FF);
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 80px;
  background-color: rgba(0, 0, 0, 0.9);
  padding-top: 1rem;
  padding-bottom: 1rem;
  z-index: 1001;
  transition: width 0.3s ease;
}

.sidebar-expanded {
  width: 250px; /* Expanded width */
}

.logo-container {
  padding-bottom: 1rem;
  border-bottom: 1px solid;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: center;
}

.logo img {
  max-height: 40px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.nav-text {
  display: none;
  color: #fafafa;
  font-size: 1.5rem;
}

.logo-container .nav-text {
  font-size: 2.5rem;
}

/* Sidebar Navigation */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  color: #fafafa;
  text-decoration: none;
  transition: color 0.3s ease;
  padding-top: 1rem;
}

.sidebar-expanded .nav-link {
  min-width: 200px;
  width: 100%;
  padding: 0.75rem 0 0.75rem 1rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.nav-link svg {
  height: 30px;
}

/* Show text when sidebar is expanded */
.sidebar-expanded .nav-text {
  display: inline;
  margin-left: 1rem;
}
</style>
