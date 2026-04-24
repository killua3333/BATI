<template>
  <div class="question-card card">
    <p class="question-index">第 {{ String(question.id).padStart(2, '0') }} 题</p>
    <h3 class="question-title">{{ question.prompt }}</h3>
    <div class="option-grid">
      <button
        v-for="o in question.options"
        :key="o.key"
        class="option-btn tactical-option"
        @click="$emit('select', o.score, o.triggers)"
      >
        <span class="opt-key">{{ o.key }}</span>
        <span class="opt-text">{{ o.text }}</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { QuizQuestion } from '../types/quiz';
defineProps<{question:QuizQuestion}>();
defineEmits<{select:[score:1|2|3, triggers?: 'keyboard-warrior']}>();
</script>
