<script>
import Lives from "../components/Lives.vue";
import { getVoice, setFocus } from "../util.js";

export default {
  name: "App",
  components: {
    Lives,
  },
  props: {
    mode: String,
    voice: String,
  },
  data() {
    return {
      speech: undefined,
      lives: 3,
      score: 0,
      error: false,
      maxNumber: undefined,
      number: undefined,
      numbers: [],
      guess: undefined,
      intervalId: undefined,
      timeLeft: 0,
    };
  },
  mounted() {
      this.maxNumber = (() => {
        switch (this.mode) {
          case "easy": return 99;
          case "medium": return 999;
          case "hard": return 9999;
          default: return 99;
        }})();

      this.speech = new SpeechSynthesisUtterance();
      this.speech.volume = 100;
      this.speech.rate = 1;
      this.speech.pitch = 1;
      this.speech.voice = getVoice(this.voice);

      this.speech.onend = (event) => {
        this.tick();
        this.intervalId = setInterval(this.tick, 1000);
      };
  },
  methods: {
    tick() {
      if (--this.timeLeft > 0) return;

      clearInterval(this.intervalId);
      this.guess = this.number;
      this.error = true;

      if (--this.lives == 0) {
        setTimeout(() => (this.$router.push(`/gameover/${this.score}`)), 3000);
      }
    },
    start() {
      this.guess = '';
      this.error = false;
      this.speech.text = this.number = this.getNumber();
      console.log(this.number);

      speechSynthesis.speak(this.speech);

      this.timeLeft = 6;
      this.$nextTick(() => setFocus(this.$refs.input));
      setTimeout(() => window.scrollTo(0, 0), 200);
    },
    check() {
      if (this.guess != this.number) return;

      clearInterval(this.intervalId);
      this.score++;
      this.start();
    },
    back() {
      clearInterval(this.intervalId);
      this.$router.push(this.score > 0 ? `/gameover/${this.score}` : '/');
    },
    getNumber() {
      if (this.numbers.length == 0) {
        this.numbers = [...Array(this.maxNumber + 1).keys()]
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
      }
      return this.numbers.pop();
    },
  },
};
</script>

<template>
  <span class="topbar">
    <Lives :lives="lives" />
    <span class="back" v-on:click="back()"></span>
  </span>
  <button
    class="button circle play"
    v-bind:disabled="(timeLeft > 0 || lives == 0)"
    v-on:click="start()"
  ></button>
  <input
    class="number-input"
    ref="input"
    v-bind:class="{ error: error }"
    v-bind:disabled="timeLeft <= 0"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    v-model="guess"
    @keyup="check()"
  />
  <progress
    class="progress"
    v-bind:class="{ hidden: timeLeft == 0 }"
    v-bind:value="timeLeft - 1"
    max="5"
  ></progress>
  <div class="score" v-bind:class="{ hidden: score < 0 }">{{ score }}</div>
</template>

<style>
.back {
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmVyc2lvbj0iMS4xIgogICBoZWlnaHQ9IjMwIgogICB3aWR0aD0iMjkuOTk5OTk4IgogICBpZD0ic3ZnMTMiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImNyb3NzLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4yLjIgKGIwYTg0ODY1NDEsIDIwMjItMTItMDEpIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MTUiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxOS43NDQyMTIiCiAgICAgaW5rc2NhcGU6Y3g9IjcuNjk4NDU4OCIKICAgICBpbmtzY2FwZTpjeT0iMTUuNTc0MTg1IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDYwIgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMTMiIC8+CiAgPGRlZnMKICAgICBpZD0iZGVmczciPgogICAgPHN0eWxlCiAgICAgICB0eXBlPSJ0ZXh0L2NzcyIKICAgICAgIGlkPSJzdHlsZTIiPjwhW0NEQVRBWwogICAgLm91dGxpbmUgeyBzdHJva2U6bm9uZTsgc3Ryb2tlLXdpZHRoOjAgfQogIF1dPjwvc3R5bGU+CiAgICA8ZwogICAgICAgaWQ9ImhlYXJ0Ij4KICAgICAgPHBhdGgKICAgICAgICAgZD0iTSAwLDIwMCBWIDAgaCAyMDAgYSAxMDAsMTAwIDkwIDAgMSAwLDIwMCAxMDAsMTAwIDkwIDAgMSAtMjAwLDAgeiIKICAgICAgICAgaWQ9InBhdGg0IiAvPgogICAgPC9nPgogIDwvZGVmcz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiMzMzMzMzM7c3Ryb2tlOiMzMzMzMzM7c3Ryb2tlLXdpZHRoOjYuODY5MDg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46YmV2ZWw7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIKICAgICBkPSJNIDIuNDI4NTgxLDIuNDI4NTkyMSAyNy41NzE0MTksMjcuNTcxMzE1IgogICAgIGlkPSJwYXRoMTU1NiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiMzMzMzMzM7c3Ryb2tlOiMzMzMzMzM7c3Ryb2tlLXdpZHRoOjYuODY5MDg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46YmV2ZWw7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIKICAgICBkPSJNIDI3LjU3MTQxOSwyLjQyODU5MjEgMi40Mjg1ODEsMjcuNTcxMzE1IgogICAgIGlkPSJwYXRoMTU1Ni0zIiAvPgo8L3N2Zz4K");
  background-size: contain;
  background-repeat: no-repeat;
  width: 1.6rem;
  height: 1.5rem;
  margin-top: 1rem;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.topbar {
  margin-bottom: 6rem;
}

.score {
  color: #42b7c4;
  font-size: 2rem;
  font-family: monospace;
  font-weight: 600;
}

.button.circle {
  border-radius: 50%;
  width: 8rem;
  height: 8rem;
}
.button.circle.play {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGhlaWdodD0iMjgiIHdpZHRoPSIyNCIgaWQ9InN2ZzEzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPiA8ZGVmcyBpZD0iZGVmczciPiA8c3R5bGUgdHlwZT0idGV4dC9jc3MiIGlkPSJzdHlsZTIiPiAub3V0bGluZXtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MH0gPC9zdHlsZT4gPGcgaWQ9ImhlYXJ0Ij4gPHBhdGggZD0iTTAgMjAwVjBoMjAwYTEwMCAxMDAgOTAgMCAxIDAgMjAwIDEwMCAxMDAgOTAgMCAxLTIwMCAweiIgaWQ9InBhdGg0Ii8+IDwvZz4gPC9kZWZzPiA8cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBpZD0icGF0aDExMzAiIGQ9Ik0xOC42MzcgNC4yODEtMS44NjEgMTYuMTE2di0yMy42N3oiIHRyYW5zZm9ybT0ibWF0cml4KDEuMTcwODYgMCAwIDEuMTgzIDIuMTc5IDguOTM1KSIvPiA8L3N2Zz4=");
  background-position: center center;
  background-size: 2.6rem;
  background-repeat: no-repeat;
}

.number-input {
  padding: 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #056d96;
  border-width: 0.3rem;
  border-style: solid;
  border-color: #42b7c4;
  border-radius: 0.8rem;
  width: 16rem;
  text-align: center;
  outline: transparent;

  -webkit-transition: background-color 0.5s ease-out;
  -moz-transition: background-color 0.5s ease-out;
  -o-transition: background-color 0.5s ease-out;
  transition: background-color 0.5s ease-out;
  background-color: #ffffff;
}
.number-input.error {
  animation: shake 0.5s;
  transform: translate(0, 0);

  -webkit-transition: background-color 0.5s ease-out;
  -moz-transition: background-color 0.5s ease-out;
  -o-transition: background-color 0.5s ease-out;
  transition: background-color 0.5s ease-out;
  background-color: #ffb3b3;
}
.number-input:disabled {
  opacity: 100%; /* Safari dims the input when disabled */
}

.progress {
  min-width: 16rem;
  border-width: 0.2rem;
  color: #42b7c4;
  background-color: #ffffff;
  border-style: solid;
  border-color: #42b7c4;
  border-radius: 0.8rem;

  -webkit-appearance: none;
  appearance: none;

  -webkit-transition: opacity 0.25s ease-out;
  -moz-transition: opacity 0.25s ease-out;
  -o-transition: opacity 0.25s ease-out;
  transition: opacity 0.25s ease-out;
}
.progress::-moz-progress-bar { background: #42b7c4; }
.progress::-webkit-progress-bar { background: #ffffff; border-radius: 0.8rem; }
.progress::-webkit-progress-value { background: #42b7c4; }
</style>