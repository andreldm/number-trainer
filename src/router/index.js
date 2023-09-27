import { createRouter, createMemoryHistory } from "vue-router";
import MenuView from "../views/MenuView.vue";
import PreferencesView from "../views/PreferencesView.vue";

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "menu",
      component: MenuView,
    },
    {
      path: "/gameover/:newScore/:oldScore",
      name: "gameover",
      props: true,
      component: () => import("../views/GameOverView.vue"),
    },
    {
      path: "/main/:mode/:voice",
      name: "main",
      props: true,
      component: () => import("../views/MainView.vue"),
    },
    {
      path: "/preferences",
      name: "preferences",
      component: PreferencesView,
    },
  ],
});

export default router;
