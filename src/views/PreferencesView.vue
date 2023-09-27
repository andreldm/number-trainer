<script>
import { getVoices, getVoice } from "../util.js";
import {
  Keys,
  loadPreference,
  savePreference,
  resetScores,
} from "../persistence.js";

export default {
  name: "Preferences",
  data() {
    return {
      mode: loadPreference(Keys.LAST_MODE, ""),
      voice: loadPreference(Keys.LAST_VOICE, ""),
      voices: [],
      speech: undefined,
      volume: loadPreference(Keys.PREFERENCE_VOLUME, 1),
      rate: loadPreference(Keys.PREFERENCE_RATE, 1),
      pitch: loadPreference(Keys.PREFERENCE_PITCH, 1),
    };
  },
  mounted() {
    getVoices((voices) => {
      this.voices = voices;

      this.speech = new SpeechSynthesisUtterance();
      this.speech.volume = this.volume;
      this.speech.rate = this.rate;
      this.speech.pitch = this.pitch;
      this.speech.voice = getVoice(this.voice);
      this.speech.lang = this.speech.voice.lang;
      this.speech.text = 42;
    });
  },
  methods: {
    test() {
      console.log(this.speech.volume);
      if (this.speech) speechSynthesis.speak(this.speech);
    },
    resetScores() {
      if (confirm("Are you sure you want to reset all scores?")) {
        resetScores();
      }
    },
    save() {
      savePreference(Keys.PREFERENCE_VOLUME, this.volume);
      savePreference(Keys.PREFERENCE_RATE, this.rate);
      savePreference(Keys.PREFERENCE_PITCH, this.pitch);
      this.$router.push(`/`);
    },
    cancel() {
      this.$router.push(`/`);
    },
  },
  watch: {
    volume: function (value) {
      this.speech.volume = value;
    },
    rate: function (value) {
      this.speech.rate = value;
    },
    pitch: function (value) {
      this.speech.pitch = value;
    },
  },
};
</script>

<template>
  <h1 class="title">Preferences</h1>

  <div class="range-group">
    <label for="volume">Volume</label>
    <input
      type="range"
      id="volume"
      min="0"
      max="1"
      step="0.1"
      v-model="volume"
    />

    <label for="rate">Rate</label>
    <input
      type="range"
      id="rate"
      min="0.1"
      max="10"
      step="0.1"
      v-model="rate"
    />

    <label for="pitch">Pitch</label>
    <input type="range" id="pitch" min="0" max="2" step="0.1" v-model="pitch" />
  </div>

  <select class="select" v-model="voice" label="labels">
    <option disabled value="">
      {{ voices.length == 0 ? "Loading voices..." : "Please select voice" }}
    </option>
    <option v-for="v in voices" v-bind:value="v.name">
      {{ v.name }} ({{ v.lang }})
    </option>
  </select>
  <button class="button" v-on:click="test()">Test</button>

  <br />

  <button class="button" v-on:click="resetScores()">Reset Scores</button>

  <br />

  <span class="button-group">
    <button class="button" v-on:click="save()">Save</button>
    <button class="button" v-on:click="cancel()">Cancel</button>
  </span>
</template>

<style scoped>
br {
  margin: 0.8rem;
}

.title {
  top: 0;
  margin-top: 0;
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

.button-group {
  display: flex;
  gap: 0.2rem;
}

.range-group {
  display: grid;
  width: 80%;
}

.select {
  min-width: 16rem;
  max-width: 18rem;
  -webkit-appearance: none;
  appearance: none;
  text-align-last: center;
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
