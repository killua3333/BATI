const fs = require('fs');
const path = require('path');
const root = 'c:/Users/31882/Desktop/BATI/web';
const files = {
  'src/main.ts': `import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

createApp(App).use(router).mount('#app');
`,
  'src/App.vue': `<template>
  <div class="app-shell">
    <header class="topbar">
      <AppIcon />
      <nav>
        <RouterLink to="/">棣栭〉</RouterLink>
        <RouterLink to="/quiz">寮€濮嬫祴璇?/RouterLink>
        <RouterLink to="/characters">瑙掕壊鍥鹃壌</RouterLink>
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
`,
  'src/style.css': `* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; }
a { color: #93c5fd; text-decoration: none; margin-right: 12px; }
.app-shell { min-height: 100vh; }
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #334155; }
.container { max-width: 960px; margin: 0 auto; padding: 24px; }
.card { background: #111827; border: 1px solid #334155; border-radius: 12px; padding: 16px; }
.btn { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 8px 12px; cursor: pointer; display: inline-block; }
.progress { height: 8px; background: #1e293b; border-radius: 999px; overflow: hidden; }
.progress > div { height: 100%; background: #22c55e; }
.option-btn { width: 100%; margin-top: 8px; text-align: left; background: #1f2937; color: #e5e7eb; border: 1px solid #374151; padding: 10px; border-radius: 8px; cursor: pointer; }
pre { white-space: pre-wrap; }
`,
  'src/types/quiz.ts': `export type Dimension = 'usage' | 'range' | 'physical' | 'playmaking' | 'defense' | 'temperament';
export interface QuizOption { key: 'A'|'B'|'C'; text: string; score: 1|2|3; }
export interface QuizQuestion { id:number; dimension:Dimension; prompt:string; options:QuizOption[]; }
`,
  'src/data/questions.json': JSON.stringify([
    {id:1,dimension:'usage',prompt:'How do you start offense?',options:[{key:'A',text:'Move off ball',score:1},{key:'B',text:'Get wing touch',score:2},{key:'C',text:'Call for ball',score:3}]},
    {id:2,dimension:'range',prompt:'Defender gives space, you...',options:[{key:'A',text:'Drive to rim',score:1},{key:'B',text:'Pull-up midrange',score:2},{key:'C',text:'Shoot three',score:3}]},
    {id:3,dimension:'physical',prompt:'Big help defender meets you',options:[{key:'A',text:'Use finesse finish',score:1},{key:'B',text:'Seek contact',score:2},{key:'C',text:'Power through',score:3}]},
    {id:4,dimension:'playmaking',prompt:'You get trapped on wing',options:[{key:'A',text:'Force shot',score:1},{key:'B',text:'Swing pass',score:2},{key:'C',text:'Create assist',score:3}]},
    {id:5,dimension:'defense',prompt:'Star opponent is hot',options:[{key:'A',text:'Save energy',score:1},{key:'B',text:'Help defense',score:2},{key:'C',text:'Ask to guard him',score:3}]},
    {id:6,dimension:'temperament',prompt:'After game-winner',options:[{key:'A',text:'Stay calm',score:1},{key:'B',text:'Celebrate with team',score:2},{key:'C',text:'Roar to crowd',score:3}]}
  ], null, 2),
  'src/data/archetypes.json': JSON.stringify([
    {id:'floor-general',title:'Floor General',description:'Control pace and create for teammates.',vector:{usage:3,range:2,physical:1,playmaking:3,defense:2,temperament:2}},
    {id:'two-way-wing',title:'Two-way Wing',description:'Balanced impact on both ends.',vector:{usage:2,range:2,physical:2,playmaking:2,defense:3,temperament:2}},
    {id:'volume-scorer',title:'Volume Scorer',description:'High-usage shot creator.',vector:{usage:3,range:3,physical:2,playmaking:2,defense:1,temperament:3}}
  ], null, 2),
  'src/composables/useQuiz.ts': `import { computed, ref } from 'vue';
import questions from '../data/questions.json';
import archetypes from '../data/archetypes.json';
import type { Dimension } from '../types/quiz';

const dims: Dimension[] = ['usage','range','physical','playmaking','defense','temperament'];
const state = { index: ref(0), answers: ref<Record<number,1|2|3>>({}) };

export function useQuiz(){
  const current = computed(()=> questions[state.index.value]);
  const finished = computed(()=> state.index.value >= questions.length);
  const progress = computed(()=> ((state.index.value)/questions.length)*100);
  function select(score:1|2|3){ if(finished.value) return; state.answers.value[current.value.id]=score; state.index.value += 1; }

  const result = computed(()=>{
    const v: Record<Dimension, number> = {usage:2,range:2,physical:2,playmaking:2,defense:2,temperament:2};
    for (const d of dims){
      const arr = questions.filter(q=>q.dimension===d).map(q=>state.answers.value[q.id]).filter(Boolean) as number[];
      v[d] = arr.length ? Number((arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(2)) : 2;
    }
    let best = archetypes[0]; let bestDist = 1e9;
    for (const a of archetypes){
      const dist = dims.reduce((s,d)=> s + Math.abs(v[d]-a.vector[d]), 0);
      if(dist<bestDist){bestDist=dist; best=a;}
    }
    return { vector:v, archetype:best };
  });

  return { current, finished, progress, select, result };
}
`,
  'src/components/AppIcon.vue': `<template><strong>BATI</strong></template>
`,
  'src/components/ProgressBar.vue': `<template><div class="progress"><div :style="{ width: value + '%' }" /></div></template>
<script setup lang="ts">defineProps<{ value:number }>();</script>
`,
  'src/components/QuestionCard.vue': `<template><div class="card"><h3>Q{{question.id}}. {{question.prompt}}</h3><button v-for="o in question.options" :key="o.key" class="option-btn" @click="$emit('select', o.score)">{{o.key}}. {{o.text}}</button></div></template>
<script setup lang="ts">
import type { QuizQuestion } from '../types/quiz';
defineProps<{question:QuizQuestion}>();
defineEmits<{select:[score:1|2|3]}>();
</script>
`,
  'src/components/ResultSummary.vue': `<template><div class="card"><h2>{{title}}</h2><p>{{description}}</p></div></template>
<script setup lang="ts">defineProps<{title:string;description:string}>();</script>
`,
  'src/pages/HomePage.vue': `<template><section class="card"><h1>BATI Quiz</h1><RouterLink class="btn" to="/intro">Start</RouterLink></section></template>
<script setup lang="ts">import { RouterLink } from 'vue-router';</script>
`,
  'src/pages/IntroPage.vue': `<template><section class="card"><h2>Intro</h2><p>Local runnable MVP scaffold.</p><RouterLink class="btn" to="/quiz">Go Quiz</RouterLink></section></template>
<script setup lang="ts">import { RouterLink } from 'vue-router';</script>
`,
  'src/pages/QuizPage.vue': `<template><section><ProgressBar :value="progress" /><div style="height:12px"></div><QuestionCard v-if="!finished && current" :question="current" @select="select" /><div v-else class="card"><p>Finished</p><RouterLink class="btn" to="/result">View Result</RouterLink></div></section></template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import ProgressBar from '../components/ProgressBar.vue';
import QuestionCard from '../components/QuestionCard.vue';
import { useQuiz } from '../composables/useQuiz';
const { current, progress, finished, select } = useQuiz();
</script>
`,
  'src/pages/ResultPage.vue': `<template><section><ResultSummary :title="result.archetype.title" :description="result.archetype.description" /><pre class="card">{{ JSON.stringify(result.vector, null, 2) }}</pre></section></template>
<script setup lang="ts">
import ResultSummary from '../components/ResultSummary.vue';
import { useQuiz } from '../composables/useQuiz';
const { result } = useQuiz();
</script>
`,
  'src/pages/CharactersPage.vue': `<template><section class="card"><h2>Characters</h2><p>Placeholder page.</p></section></template>
`,
  'src/pages/StatsPage.vue': `<template><section class="card"><h2>Stats</h2><p>Placeholder page.</p></section></template>
`,
  'src/pages/AboutPage.vue': `<template><section class="card"><h2>About</h2><p>BATI scaffold.</p></section></template>
`,
  'src/router/index.ts': `import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import IntroPage from '../pages/IntroPage.vue';
import QuizPage from '../pages/QuizPage.vue';
import ResultPage from '../pages/ResultPage.vue';
import CharactersPage from '../pages/CharactersPage.vue';
import StatsPage from '../pages/StatsPage.vue';
import AboutPage from '../pages/AboutPage.vue';

export default createRouter({
  history: createWebHistory(),
  routes:[
    {path:'/',component:HomePage},
    {path:'/intro',component:IntroPage},
    {path:'/quiz',component:QuizPage},
    {path:'/result',component:ResultPage},
    {path:'/characters',component:CharactersPage},
    {path:'/stats',component:StatsPage},
    {path:'/about',component:AboutPage}
  ]
});
`,
  'src/components/SharePoster.vue': `<template><div class="card">Share Poster Placeholder</div></template>
`,
  'src/components/AdsenseSlot.vue': `<template><div class="card">AdSense Placeholder</div></template>
`,
  'src/composables/useShare.ts': `export function useShare(){
  async function shareText(text:string){
    if (navigator.share){ await navigator.share({ text }); return true; }
    await navigator.clipboard.writeText(text);
    return false;
  }
  return { shareText };
}
`,
  'src/data/characters.json': JSON.stringify([{id:'lebron',name:'LeBron James'},{id:'kawhi',name:'Kawhi Leonard'},{id:'kobe',name:'Kobe Bryant'}], null, 2),
  'src/data/characterVisuals.json': JSON.stringify({lebron:{theme:'gold'}}, null, 2),
  'src/data/characterProbabilities.json': JSON.stringify({lebron:0.34,kawhi:0.33,kobe:0.33}, null, 2),
  'src/i18n/messages.ts': `export const messages = {
  'zh-CN': { homeTitle: 'BATI' },
  'zh-TW': { homeTitle: 'BATI' },
  en: { homeTitle: 'BATI' },
  ja: { homeTitle: 'BATI' }
};
`,
  'src/utils/quizEngine.ts': `export * from '../composables/useQuiz';
`,
  'src/utils/characterVisuals.ts': `import v from '../data/characterVisuals.json';
export default v;
`,
  'src/utils/characterProbability.ts': `import p from '../data/characterProbabilities.json';
export default p;
`,
  'src/utils/statsReporter.ts': `export async function reportResult(payload: unknown){ console.log(payload); }
`,
  'src/utils/runtimeApi.ts': `export async function getJSON<T>(url:string):Promise<T>{ const res = await fetch(url); if(!res.ok) throw new Error('Request failed'); return res.json() as Promise<T>; }
`,
  'src/utils/adsense.ts': `export const ADSENSE_CLIENT = 'ca-pub-demo';
`,
  'src/utils/storage.ts': `export const storage={ get<T>(key:string,fallback:T){ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; }, set(key:string,value:unknown){ localStorage.setItem(key, JSON.stringify(value)); } };
`,
  'src/content/characters/.gitkeep': '',
  'functions/.gitkeep': '',
  'migrations/.gitkeep': ''
};

for (const [rel, content] of Object.entries(files)) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
}
console.log('created', Object.keys(files).length, 'files');
