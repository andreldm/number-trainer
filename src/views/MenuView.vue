<script>
import { getVoices, getScore } from "../util.js";

export default {
  name: "Menu",
  data() {
    return {
      mode: undefined,
      voice: localStorage.getItem('last-selected-voice') || '',
      voices: [],
    };
  },
  mounted() {
    getVoices(voices => this.voices = voices);
  },
  methods: {
    start() {
      this.$router.push(`/main/${this.mode}/${this.voice}`);
    },
    setMode(mode) {
      this.mode = mode;
    },
  },
  watch: {
    voice: (value) => { localStorage.setItem('last-selected-voice', value) }
  },
  computed: {
    bestScore() {
      return getScore(this.mode, this.voice);
    }
  }
};
</script>

<template>
  <h1 class="title">Number Trainer</h1>

  <span class="button-group">
    <button
      class="button"
      v-bind:class="{ selected: mode == 'easy' }"
      v-on:click="setMode('easy')"
    >
      <div>Easy</div>
      <div class="small">0-99</div>
    </button>
    <button
      class="button"
      v-bind:class="{ selected: mode == 'medium' }"
      v-on:click="setMode('medium')"
    >
      <div>Medium</div>
      <div class="small">0-999</div>
    </button>
    <button
      class="button"
      v-bind:class="{ selected: mode == 'hard' }"
      v-on:click="setMode('hard')"
    >
      <div>Hard</div>
      <div class="small">0-9999</div>
    </button>
  </span>

  <select class="select" v-model="voice" label="labels">
    <option disabled value="">{{ voices.length == 0 ? "Loading voices..." : "Please select voice" }}</option>
    <option v-for="v in voices" v-bind:value="v.name">
      {{ v.name }} ({{ v.lang }})
    </option>
  </select>

  <button
    class="button"
    v-bind:disabled="mode == undefined || voice == ''"
    v-on:click="start()"
  >
    Start
  </button>

  <div v-show="bestScore > 0">Best Score is {{ bestScore }}</div>
</template>

<style>
.title {
  top: 0;
  margin-top: 3rem;
  padding: 0;
  font-size: 2.4rem;
  font-weight: 600;
}

@media (hover: hover) and (pointer: fine) {
  .button:hover:enabled {
    background-color: var(--primary-color);
    filter: brightness(120%);
  }
}
.button-group .button {
  border-radius: 0;
  margin: 0;
  font-size: 1.5rem;
  min-width: 6.5rem;
}
.button-group .button:first-child {
  border-top-left-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
}
.button-group .button:last-child {
  border-top-right-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
}
.button-group .button.selected {
  background-color: var(--primary-color-darker);
}

.small {
  font-size: 0.5em;
}

.select {
  min-width: 16rem;
  max-width: 18rem;
  -webkit-appearance: none;
  appearance: none;
  text-align-last:center;
  border: 0.2rem solid var(--primary-color);
  border-radius: 0.3rem;
  padding: 0.25em 0.5em;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: var(--primary-color);
  color: #fff;
  font-weight: 600;
}
</style>