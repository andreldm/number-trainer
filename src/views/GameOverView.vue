<script>
export default {
  name: "GameOver",
  props: {
    score: String,
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
  <div class="score">{{ score }}</div>
  <button class="button" v-on:click="menu()">Menu</button>
</template>
