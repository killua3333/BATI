import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import QuizPage from '../pages/QuizPage.vue';
import ResultPage from '../pages/ResultPage.vue';
import CharactersPage from '../pages/CharactersPage.vue';
import StatsPage from '../pages/StatsPage.vue';
import AboutPage from '../pages/AboutPage.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes:[
    {path:'/',component:HomePage},
    {path:'/quiz',component:QuizPage},
    {path:'/result',component:ResultPage},
    {path:'/characters',component:CharactersPage},
    {path:'/stats',component:StatsPage},
    {path:'/about',component:AboutPage}
  ]
});
