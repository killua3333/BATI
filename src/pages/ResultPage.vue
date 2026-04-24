<template>
  <section v-if="result.isEasterEgg" class="scouting-page">
    <article class="stats-panel scout-frame easter-egg-panel">
      <p class="mono-tag">隐藏结局 / 键盘侠模式</p>
      <h1 class="egg-title">键盘侠杜兰特形态</h1>
      <img class="player-photo" :src="currentPhoto" :alt="result.matchedCharacter.name" />
      <p class="egg-desc">
        你在隐藏题中触发了“社媒对线”路线，本次结果为彩蛋结局，不参与常规六维最近邻匹配。
      </p>
      <p class="egg-desc">建议重测一次，体验正常球探报告结果。</p>
      <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
        <RouterLink class="btn btn-start" to="/quiz" @click="reset">重新测试</RouterLink>
      </div>
    </article>
  </section>

  <section v-else class="scouting-page">
    <header class="report-header scout-frame">
      <span>机密球探报告</span>
      <strong>BATI</strong>
    </header>

    <div class="report-grid">
      <article class="profile-panel scout-frame">
        <p class="mono-tag">球员画像</p>
        <h1>{{ result.matchedCharacter.name }}</h1>
        <span class="badge verdict-badge">{{ scoutVerdict }}</span>
        <div class="silhouette-wrap">
          <img class="player-photo" :src="currentPhoto" :alt="result.matchedCharacter.name" />
          <span class="badge">
            {{ result.hiddenOutcome ? '键盘侠形态' : archetypeLabel }}
          </span>
        </div>
      </article>

      <article class="notes-panel scout-frame">
        <section class="executive-summary">
          <p class="mono-tag">SCOUT'S VERDICT</p>
          <blockquote>{{ executiveSummary }}</blockquote>
        </section>
        <section class="note-card">
          <p class="mono-tag">球风分析</p>
          <p>{{ result.matchedCharacter.style }}</p>
        </section>
        <section class="note-card">
          <p class="mono-tag">人格特质</p>
          <p>{{ result.matchedCharacter.personality }}</p>
        </section>
      </article>
    </div>

    <article class="stats-panel scout-frame">
      <p class="mono-tag">六维能力分布</p>
      <div class="radar-wrap">
        <svg class="radar-svg" viewBox="0 0 360 300" role="img" aria-label="六维雷达图">
          <g transform="translate(180,150)">
            <polygon
              v-for="(ring, idx) in radarRings"
              :key="`ring-${idx}`"
              :points="toPoints(ring)"
              class="radar-ring"
            />
            <line
              v-for="(axis, idx) in radarAxes"
              :key="`axis-${idx}`"
              x1="0"
              y1="0"
              :x2="axis.x"
              :y2="axis.y"
              class="radar-axis"
            />
            <polygon :points="toPoints(radarValues)" class="radar-area" />
            <circle
              v-for="(pt, idx) in radarValues"
              :key="`dot-${idx}`"
              :cx="pt.x"
              :cy="pt.y"
              r="3.2"
              class="radar-dot"
            />
          </g>
          <g>
            <text
              v-for="(label, idx) in radarLabels"
              :key="`label-${idx}`"
              :x="label.x"
              :y="label.y"
              class="radar-label"
            >
              {{ label.name }} {{ label.grade }}
            </text>
          </g>
        </svg>
      </div>
      <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
        <RouterLink class="btn btn-start" to="/quiz" @click="reset">重新测试</RouterLink>
      </div>
    </article>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useQuiz } from '../composables/useQuiz';
import { getPlayerPhoto } from '../utils/playerPhoto';

const { result, reset } = useQuiz();
const currentPhoto = computed(() => getPlayerPhoto(result.value.matchedCharacter.id));

const labelMap: Record<string, string> = {
  usage: '球权',
  range: '区域',
  physical: '对抗',
  playmaking: '战术',
  defense: '防守',
  temperament: '情绪'
};

function gradeByScore(score: number): string {
  // 分母为 3 或 4 时可达平均分：
  // 1.00, 1.25, 1.33, 1.50, 1.67, 1.75, 2.00, 2.25, 2.33, 2.50, 2.67, 2.75, 3.00
  // 下面阈值以这些离散点为中心分层，避免出现“评级真空区间”。
  if (score >= 2.875) return 'S';   // 3.00
  if (score >= 2.625) return 'A+';  // 2.67 / 2.75
  if (score >= 2.375) return 'A';   // 2.50
  if (score >= 2.125) return 'A-';  // 2.25 / 2.33
  if (score >= 1.875) return 'B+';  // 2.00
  if (score >= 1.625) return 'B';   // 1.67 / 1.75
  return 'B-';
}

const statRows = computed(() =>
  Object.entries(result.value.vector).map(([key, score]) => ({
    key,
    label: labelMap[key] ?? key,
    percent: Math.min(100, Math.max(0, ((score - 1) / 2) * 100)),
    grade: gradeByScore(score)
  }))
);

const archetypeLabel = computed(() => {
  const offense = (result.value.vector.usage + result.value.vector.range) / 2;
  const control = (result.value.vector.playmaking + result.value.vector.temperament) / 2;
  if (offense > 2.4) return '致命得分手';
  if (control > 2.4) return '战术指挥官';
  return '攻防一体型';
});

const scoutVerdict = computed(() => {
  const vector = result.value.vector;
  const entries = Object.entries(vector) as [keyof typeof vector, number][];
  const maxScore = Math.max(...entries.map(([, score]) => score));
  const topDims = entries
    .filter(([, score]) => score === maxScore)
    .map(([dim]) => dim)
    .slice(0, 2);

  const key = [...topDims].sort().join('+');
  const verdictMap: Record<string, string> = {
    'range+usage': '空间主攻手',
    'defense+physical': '铁血大闸',
    'playmaking+usage': '战术发动机',
    'playmaking+temperament': '冷静指挥官',
    'range+playmaking': '外线策应核',
    'physical+usage': '重装冲击点',
    defense: '防守支柱',
    physical: '对抗核心',
    playmaking: '组织中枢',
    range: '投射火力点',
    usage: '持球主攻手',
    temperament: '大心脏终结者'
  };
  return verdictMap[key] ?? verdictMap[topDims[0] as string] ?? '全能比赛影响者';
});

const executiveSummary = computed(() => {
  const style = result.value.matchedCharacter.style?.trim() ?? '';
  if (!style) return '该球员具备鲜明的球场风格与稳定的核心输出能力。';
  const firstSegment = style.split(/[，,。]/)[0]?.trim();
  return firstSegment || style;
});

const centerX = 180;
const centerY = 150;
const radius = 96;
const dimOrder = ['usage', 'range', 'physical', 'playmaking', 'defense', 'temperament'];

function angleAt(i: number): number {
  return ((-90 + i * 60) * Math.PI) / 180;
}

function pointByScale(i: number, scale: number): { x: number; y: number } {
  const rad = radius * scale;
  return { x: Math.cos(angleAt(i)) * rad, y: Math.sin(angleAt(i)) * rad };
}

const radarAxes = computed(() => dimOrder.map((_, i) => pointByScale(i, 1)));

const radarRings = computed(() =>
  [0.25, 0.5, 0.75, 1].map(scale => dimOrder.map((_, i) => pointByScale(i, scale)))
);

const radarValues = computed(() =>
  dimOrder.map((key, i) => {
    const raw = result.value.vector[key as keyof typeof result.value.vector];
    const scale = Math.min(1, Math.max(0, (raw - 1) / 2));
    return pointByScale(i, scale);
  })
);

const radarLabels = computed(() =>
  statRows.value.map((row, i) => {
    const p = pointByScale(i, 1.18);
    return { name: row.label, grade: row.grade, x: centerX + p.x, y: centerY + p.y };
  })
);

function toPoints(points: { x: number; y: number }[]): string {
  return points.map(p => `${p.x},${p.y}`).join(' ');
}
</script>
