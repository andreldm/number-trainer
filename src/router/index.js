import { createRouter, createMemoryHistory } from "vue-router";
import MenuView from "../views/MenuView.vue";

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "menu",
      component: MenuView,
    },
    {
      path: "/gameover/:score",
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
  ],
});

export default router;
