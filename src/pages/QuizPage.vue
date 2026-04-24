<template>
  <section class="quiz-stage">
    <ProgressBar :value="progress" :current="displayCurrent" :total="total" />
    <div style="height:14px"></div>
    <QuestionCard v-if="!finished && current" :question="current" @select="select" />
    <div v-else class="card">
      <p>答题完成。</p>
      <RouterLink class="btn btn-start" to="/result">查看结果</RouterLink>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import ProgressBar from '../components/ProgressBar.vue';
import QuestionCard from '../components/QuestionCard.vue';
import { useQuiz } from '../composables/useQuiz';
const { current, progress, finished, select, index, total } = useQuiz();
const displayCurrent = computed(() => Math.min(index.value + 1, total));
</script>
