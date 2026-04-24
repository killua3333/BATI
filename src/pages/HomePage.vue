<template>
  <section class="hero hero-asym card">
    <div class="hero-copy">
      <p class="intro-tag">BATI 主界面</p>
      <h1>发现你的球场人格原型</h1>
      <p class="hero-subtitle">通过高压决策、节奏掌控与对抗选择，解析你的篮球风格与心理特质。</p>
      <RouterLink class="btn btn-start" to="/quiz">开始答题</RouterLink>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="hero-backlight"></div>
      <svg class="wireframe-ball" viewBox="0 0 320 320">
        <circle cx="160" cy="160" r="118" class="wf-ring" />
        <ellipse cx="160" cy="160" rx="118" ry="44" class="wf-line" />
        <ellipse cx="160" cy="160" rx="118" ry="86" class="wf-line" />
        <ellipse cx="160" cy="160" rx="44" ry="118" class="wf-line" />
        <ellipse cx="160" cy="160" rx="86" ry="118" class="wf-line" />
        <path d="M42 160h236" class="wf-line" />
        <path d="M160 42c28 22 45 70 45 118s-17 96-45 118" class="wf-accent" />
        <path d="M160 42c-28 22-45 70-45 118s17 96 45 118" class="wf-accent" />
      </svg>
    </div>
  </section>
</template>
<script setup lang="ts">import { RouterLink } from 'vue-router';</script>
