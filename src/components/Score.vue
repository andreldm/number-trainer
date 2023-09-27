<script>
export default {
  name: "ScoreCounter",
  props: {
    score: Number,
    bestScore: Number,
  },
};
</script>

<template>
  <div class="score">
    <span>Score </span>
    <span>{{ score }}</span>
    <span v-show="score > bestScore" title="New Record!">*</span>
  </div>
</template>

<style>
.score {
  display: inline-block;
  grid-column-start: 2;
  font-size: 1.6rem;
  font-family: monospace;
  font-weight: 600;
  line-height: 1.6rem;
}
.score > span:last-child {
  padding-left: 0.2rem;
}
</style>
