<script setup>
import useSidebar from "@/composables/useSidebar.js";
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";

const {expanded:sidebarExpanded} = useSidebar();
</script>

<template>
  <div id="app">

    <Header />
    <Sidebar />

    <main :class="['main-content', { 'main-collapsed': sidebarExpanded }]">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {

  .main-content {
    margin-left: 60px;
  }
  .main-collapsed {
    margin-left: 200px;
  }
}


/* Main content area */
.main-content {
  margin-left: 80px; /* Default width when sidebar is collapsed */
  transition: margin-left 0.3s ease;
  padding: 1rem;
}

.main-collapsed {
  margin-left: 250px; /* Adjust margin when sidebar is expanded */
}
</style>