<template>
  <section>
    <h2>球星图鉴</h2>
    <div v-for="c in characters" :key="c.id" class="card" style="margin-bottom: 12px;">
      <img class="character-photo" :src="getPlayerPhoto(c.id)" :alt="c.name" />
      <h3>{{ c.index }}. {{ c.name }}</h3>
      <p><strong>球风：</strong>{{ c.style }}</p>
      <p><strong>人格：</strong>{{ c.personality }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import rawCharacters from '../data/characters.json';
import type { CharacterProfile } from '../types/quiz';
import { getPlayerPhoto } from '../utils/playerPhoto';

const characters = rawCharacters as CharacterProfile[];
</script>
