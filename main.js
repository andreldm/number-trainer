import Menu from './components/Menu.js';
import App from './components/App.js';

const routes = [
  { path: '/', component: Menu },
  { path: '/app/:mode', component: App, props: true }
];

const router = VueRouter.createRouter({
  history: VueRouter.createMemoryHistory(),
  routes
});

const app = Vue.createApp({});
app.use(router);
app.mount('#app');
