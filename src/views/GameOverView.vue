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

<style>
.title {
  position: absolute;
  top: 0;
  margin-top: 3rem;
  padding: 0;
  color: #42b7c4;
  font-size: 2.4rem;
  font-weight: 600;
}
.subtitle {
  margin: 0;
  padding: 0;
  color: #42b7c4;
  font-size: 2rem;
  font-weight: 600;
}
</style>