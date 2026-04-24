import { computed, ref } from 'vue';
import rawQuestions from '../data/questions.json';
import rawCharacters from '../data/characters.json';
import type { CharacterProfile, Dimension, QuizQuestion } from '../types/quiz';

const questions = rawQuestions as QuizQuestion[];
const characters = rawCharacters as CharacterProfile[];
const dims: Dimension[] = ['usage','range','physical','playmaking','defense','temperament'];
const state = {
  index: ref(0),
  answers: ref<Record<number,1|2|3>>({}),
  hiddenOutcome: ref<null | 'keyboard-warrior'>(null),
};

export function useQuiz(){
  const current = computed(()=> questions[state.index.value]);
  const finished = computed(()=> state.index.value >= questions.length);
  const progress = computed(()=> ((state.index.value)/questions.length)*100);
  const total = questions.length;
  const answeredCount = computed(() => Object.keys(state.answers.value).length);
  const allAnswered = computed(() => answeredCount.value === questions.length);
  function select(score:1|2|3, triggers?: 'keyboard-warrior'){
    if (finished.value) return;
    const q = current.value;
    state.answers.value[q.id] = score;
    if (q.hiddenTrigger && triggers === 'keyboard-warrior') {
      state.hiddenOutcome.value = 'keyboard-warrior';
      state.index.value = questions.length;
      return;
    }
    state.index.value += 1;
  }

  function reset() {
    state.index.value = 0;
    state.answers.value = {};
    state.hiddenOutcome.value = null;
  }

  function calcExtremeCount(c: CharacterProfile): number {
    return dims.reduce((count, d) => count + ((c.vector[d] === 1 || c.vector[d] === 3) ? 1 : 0), 0);
  }

  const result = computed(() => {
    const v: Record<Dimension, number> = {usage:0,range:0,physical:0,playmaking:0,defense:0,temperament:0};
    for (const d of dims) {
      const arr = questions
        .filter(q => q.dimension===d)
        .map(q => state.answers.value[q.id])
        .filter(Boolean) as number[];
      v[d] = arr.length ? Number((arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(2)) : 0;
    }

    if (state.hiddenOutcome.value === 'keyboard-warrior') {
      const kd = characters.find(c => c.enName.toLowerCase().includes('durant')) ?? characters[0];
      return {
        vector: v,
        matchedCharacter: kd,
        hiddenOutcome: state.hiddenOutcome.value,
        isEasterEgg: true,
        valid: true
      };
    }

    if (!allAnswered.value) {
      return {
        vector: v,
        matchedCharacter: characters[0],
        hiddenOutcome: null,
        isEasterEgg: false,
        valid: false
      };
    }

    let best = characters[0];
    let bestDist = Number.POSITIVE_INFINITY;
    let bestExtreme = calcExtremeCount(best);
    for (const c of characters) {
      const dist = dims.reduce((sum, d)=> sum + Math.abs(v[d]-c.vector[d]), 0);
      const extreme = calcExtremeCount(c);
      if (dist < bestDist || (dist === bestDist && extreme > bestExtreme)) {
        bestDist = dist;
        best = c;
        bestExtreme = extreme;
      }
    }
    return {
      vector:v,
      matchedCharacter:best,
      hiddenOutcome: null,
      isEasterEgg: false,
      valid: true
    };
  });

  return {
    questions,
    current,
    finished,
    progress,
    select,
    reset,
    result,
    hiddenOutcome: state.hiddenOutcome,
    index: state.index,
    total,
    answeredCount,
    allAnswered
  };
}
