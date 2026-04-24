<template>
  <div class="scoreboard-wrap">
    <div class="scoreboard-head">
      <span class="scoreboard-label">战术进度</span>
      <span class="scoreboard-counter">{{ paddedCurrent }} / {{ paddedTotal }}</span>
    </div>
    <div class="scoreboard-track">
      <div class="scoreboard-fill" :style="{ width: value + '%' }" />
      <div class="scoreboard-segments" :style="{ gridTemplateColumns: `repeat(${total}, 1fr)` }">
        <span v-for="n in total" :key="n"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ value:number; current:number; total:number }>();
const paddedCurrent = computed(() => String(props.current).padStart(2, '0'));
const paddedTotal = computed(() => String(props.total).padStart(2, '0'));
</script>
