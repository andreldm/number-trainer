<script>
export default {
  name: "GameOverView",
  props: {
    newScore: String,
    oldScore: String,
  },
  methods: {
    menu() {
      this.$router.push("/");
    },
  },
};
</script>

<template>
  <h1 class="title">Game Over</h1>
  <div class="subtitle">Your score was</div>
  <div class="score">{{ newScore }}</div>
  <div class="message" v-show="newScore > oldScore">
    &#x1F389; Congratulations new record &#x1F389;
  </div>
  <button class="button" v-on:click="menu()">Menu</button>
</template>

<style scoped>
.title {
  top: 0;
  margin-top: 3rem;
  padding: 0;
  font-size: 2.4rem;
  font-weight: 600;
}
.subtitle {
  margin: 0;
  padding: 0;
  font-size: 2rem;
  font-weight: 600;
}
.message {
  margin: 0;
  padding: 0;
  font-weight: 600;
  font-size: 1rem;
}
</style>
