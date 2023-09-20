<script>
export default {
  name: "Score",
  props: {
    score: Number,
  },
};
</script>

<template>
  <div class="score">
    <span>Score {{ score }}</span>
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
</style>
