<script>
import { getVoices } from "../util.js";

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
  }
};
</script>

<template>
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
    <option disabled value="">Please select voice</option>
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
</template>

<style>
.button:hover:enabled {
  background-color: #56d0dd;
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
  background-color: #2b97a3;
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
  border: 0.2rem solid #42b7c4;
  border-radius: 0.3rem;
  padding: 0.25em 0.5em;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #ffffff;
}
</style>