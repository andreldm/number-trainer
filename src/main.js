import Menu from './components/Menu.js';
import GameOver from './components/GameOver.js';
import App from './components/App.js';

const routes = [
  { path: '/', component: Menu },
  { path: '/gameover/:score', component: GameOver, props: true },
  { path: '/app/:mode/:voice', component: App, props: true }
];

const router = VueRouter.createRouter({
  history: VueRouter.createMemoryHistory(),
  routes
});

const app = Vue.createApp({});
app.use(router);
app.mount('#app');
