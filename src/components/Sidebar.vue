<template>
  <!-- Sidebar with logo and challenge icon list -->
  <aside :class="['sidebar', { 'sidebar-expanded': sidebarExpanded }]" @mouseenter="expand" @mouseleave="collapse">
    <div class="logo-container">
      <!-- Company logo that links to the company website and opens in a new tab -->
      <RouterLink :to="{name: 'ChallengeList'}" class="logo">
        <img src="./../assets/tribus-icon.png" alt="Tribus Icon">
        <span class="nav-text">Tribus</span>
      </RouterLink>

    </div>
    <nav class="sidebar-nav">
      <!-- Use Font Awesome icons in the nav links -->
      <RouterLink :to="{name:'ChallengeList'}" class="nav-link">
        <font-awesome-icon :icon="['fas', 'tasks']" />
        <span class="nav-text">Challenges</span>
      </RouterLink>

      <a href="#" class="nav-link">
        <font-awesome-icon :icon="['fas', 'question']" />
        <p class="nav-text">Quiz <span class="coming-soon">(coming soon)</span></p>
      </a>

      <a href="#" class="nav-link">
        <font-awesome-icon :icon="['fas', 'table-list']" />
        <p class="nav-text">Leaderboard <span class="coming-soon">(coming soon)</span></p>
      </a>
    </nav>
  </aside>
</template>

<script setup>
import useSidebar from "@/composables/useSidebar.js";
const { expanded: sidebarExpanded, expand, collapse } = useSidebar();
</script>

<style scoped>

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
  width: 225px; /* Expanded width */
}

.logo-container {
  padding-bottom: 1rem;
  border-bottom: 1px solid;
}

.coming-soon {
  font-size: 75%;
  font-weight: 400;
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
  font-size: 1.2rem;
  font-weight: 500;
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
  padding: 1rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.nav-link svg {
  height: 30px;
  width: 30px;
}

/* Show text when sidebar is expanded */
.sidebar-expanded .nav-text {
  margin-left: 1rem;
  line-height: 25px;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }

  .sidebar-expanded {
    width: 200px;
  }
}
</style>
