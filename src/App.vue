<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink to="/" class="brand-wrap">
        <AppIcon />
      </RouterLink>
      <nav class="topnav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/quiz">答题</RouterLink>
        <RouterLink to="/characters">球星图鉴</RouterLink>
      </nav>
    </header>
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import AppIcon from './components/AppIcon.vue';
</script>
