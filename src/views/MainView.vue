<script>
import Lives from "../components/Lives.vue";
import Score from "../components/Score.vue";
import { getVoice, setFocus } from "../util.js";

export default {
  name: "App",
  components: {
    Lives,
    Score,
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
      focusInput: false,
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
      this.speech.lang = this.speech.voice.lang;

      this.speech.onend = (event) => {
        clearInterval(this.intervalId);
        if (this.focusInput) {
          this.$nextTick(() => setFocus(this.$refs.input));
        }
        setTimeout(() => window.scrollTo(0, 0), 200);
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
    start(focusInput) {
      this.guess = '';
      this.error = false;
      this.focusInput = focusInput;
      this.timeLeft = 5;
      this.speech.text = this.number = this.getNumber();
      console.log(this.number);

      speechSynthesis.speak(this.speech);
    },
    check() {
      if (this.guess != this.number) return;

      clearInterval(this.intervalId);
      this.score++;
      this.start(false);
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
    <Score :score="score" />
    <span class="back" v-on:click="back()"></span>
  </span>
  <button
    class="button circle play"
    v-bind:disabled="(timeLeft > 0 || lives == 0)"
    v-on:click="start(true)"
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
    v-bind:value="timeLeft"
    max="5"
  ></progress>
</template>

<style>
.back {
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmVyc2lvbj0iMS4xIgogICBoZWlnaHQ9IjMwIgogICB3aWR0aD0iMjkuOTk5OTk4IgogICBpZD0ic3ZnMTMiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImNyb3NzLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4zICgwZTE1MGVkNmM0LCAyMDIzLTA3LTIxKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzE1IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTkuNzQ0MjEyIgogICAgIGlua3NjYXBlOmN4PSI3LjcyMzc4MjUiCiAgICAgaW5rc2NhcGU6Y3k9IjE1LjU5OTUwOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTA2MCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEzIiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM3Ij4KICAgIDxzdHlsZQogICAgICAgdHlwZT0idGV4dC9jc3MiCiAgICAgICBpZD0ic3R5bGUyIj48IVtDREFUQVsKICAgIC5vdXRsaW5lIHsgc3Ryb2tlOm5vbmU7IHN0cm9rZS13aWR0aDowIH0KICBdXT48L3N0eWxlPgogICAgPGcKICAgICAgIGlkPSJoZWFydCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwyMDAgViAwIGggMjAwIGEgMTAwLDEwMCA5MCAwIDEgMCwyMDAgMTAwLDEwMCA5MCAwIDEgLTIwMCwwIHoiCiAgICAgICAgIGlkPSJwYXRoNCIgLz4KICAgIDwvZz4KICA8L2RlZnM+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojMzMzMzMzO3N0cm9rZTojMmI5N2EzO3N0cm9rZS13aWR0aDo2Ljg2OTA4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOmJldmVsO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0iTSAyLjQyODU4MSwyLjQyODU5MjEgMjcuNTcxNDE5LDI3LjU3MTMxNSIKICAgICBpZD0icGF0aDE1NTYiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojMzMzMzMzO3N0cm9rZTojMmI5N2EzO3N0cm9rZS13aWR0aDo2Ljg2OTA4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOmJldmVsO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0iTSAyNy41NzE0MTksMi40Mjg1OTIxIDIuNDI4NTgxLDI3LjU3MTMxNSIKICAgICBpZD0icGF0aDE1NTYtMyIgLz4KPC9zdmc+Cg==");
  background-size: contain;
  background-repeat: no-repeat;
  width: 1.6rem;
  height: 1.5rem;
  cursor: pointer;
  grid-column-start: 3;
}

.topbar {
  display: grid;
  grid-template-columns: max-content auto max-content;
  column-gap: 0.8rem;
  margin-top: 1rem;
  margin-bottom: 5rem;
  width: 100%;
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
  color: var(--primary-color);
  border-width: 0.3rem;
  border-style: solid;
  border-color: var(--primary-color);
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
  color: var(--primary-color);
  background-color: #ffffff;
  border-style: solid;
  border-color: var(--primary-color);
  border-radius: 0.8rem;

  -webkit-appearance: none;
  appearance: none;

  -webkit-transition: opacity 0.25s ease-out;
  -moz-transition: opacity 0.25s ease-out;
  -o-transition: opacity 0.25s ease-out;
  transition: opacity 0.25s ease-out;
}
.progress::-moz-progress-bar { background: var(--primary-color); }
.progress::-webkit-progress-bar { background: #ffffff; border-radius: 0.8rem; }
.progress::-webkit-progress-value { background: var(--primary-color); }
</style>