<script>
export default {
  name: "Lives",
  props: {
    lives: Number,
  },
};
</script>

<template>
  <div class="hearts">
    <span v-bind:class="{ broken: lives <= 0 }" class="heart"></span>
    <span v-bind:class="{ broken: lives <= 1 }" class="heart"></span>
    <span v-bind:class="{ broken: lives <= 2 }" class="heart"></span>
  </div>
</template>
