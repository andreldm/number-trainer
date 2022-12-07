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

      if (--this.lives <= 0) {
        this.$router.push(`/gameover/${this.score}`);
        return;
      }

      this.error = true;
      setTimeout(() => (this.error = false), 500);
    },
    start() {
      this.speech.text = this.number = Math.floor(Math.random() * this.maxNumber);
      console.log(this.number);

      speechSynthesis.speak(this.speech);

      this.timeLeft = 6;
      this.$nextTick(() => setFocus(this.$refs.input));
    },
    check() {
      if (this.guess != this.number) return;

      clearInterval(this.intervalId);

      this.score++;
      this.guess = "";
      this.start();
    },
    back() {
      clearInterval(this.intervalId);
      this.$router.push(this.score > 0 ? `/gameover/${this.score}` : '/');
    },
  },
};
</script>

<template>
  <Lives :lives="lives" />
  <span class="back" v-on:click="back()">&#10799;</span>
  <button
    class="button circle play"
    v-bind:disabled="timeLeft > 0"
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
  cursor: pointer;
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 2.4rem;
  font-weight: 600;
  color: #444;
}

.hearts {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 1rem;
}

.heart {
  background-image: url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjI3LjQyNiIgd2lkdGg9IjMwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPGRlZnM+IDxsaW5lYXJHcmFkaWVudCBpZD0iYSI+IDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiNiYTAwMDA7c3RvcC1vcGFjaXR5OjEiIG9mZnNldD0iMCIvPiA8c3RvcCBzdHlsZT0ic3RvcC1jb2xvcjpyZWQ7c3RvcC1vcGFjaXR5OjEiIG9mZnNldD0iMSIvPiA8L2xpbmVhckdyYWRpZW50PiA8bGluZWFyR3JhZGllbnQgeGxpbms6aHJlZj0iI2EiIGlkPSJjIiB4MT0iMTUzLjk2OSIgeTE9Ii00NS4wNjYiIHgyPSIxMjEuNjIyIiB5Mj0iMTc3LjMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzcHJlYWRNZXRob2Q9InBhZCIvPiA8cGF0aCBkPSJNMCAyMDBWMGgyMDBhMTAwIDEwMCA5MCAwIDEgMCAyMDAgMTAwIDEwMCA5MCAwIDEtMjAwIDB6IiBpZD0iYiIvPiA8L2RlZnM+IDx1c2UgeGxpbms6aHJlZj0iI2IiIGZpbGw9InJlZCIgdHJhbnNmb3JtPSJyb3RhdGUoLTEzNC45OTkgMTMuMTggMTAuNjA3KSBzY2FsZSguMDg3ODcpIiBzdHlsZT0iZmlsbC1vcGFjaXR5OjE7ZmlsbDp1cmwoI2MpO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowIi8+IDwvc3ZnPg==");
  width: 1.6rem;
  height: 1.5rem;
  margin: 0.1rem;
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
}
.heart.broken {
  animation: shake 0.8s;
  transform: translate(0, 0);

  -webkit-transition: filter 0.8s ease-out;
  -moz-transition: filter 0.8s ease-out;
  -o-transition: filter 0.8s ease-out;
  transition: filter 0.8s ease-out;
  filter: grayscale(100%) brightness(350%);
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