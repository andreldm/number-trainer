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
      lives: 3,
      score: 0,
      error: false,
      number: undefined,
      guess: undefined,
      intervalId: undefined,
      timeLeft: 0,
    };
  },
  methods: {
    tick() {
      if (--this.timeLeft == 0) {
        this.lives--;
        this.error = true;
        this.guess = "";
        setTimeout(() => (this.error = false), 500);
        clearInterval(this.intervalId);

        if (this.lives <= 0) {
          this.$router.push(`/gameover/${this.score}`);
        }
      }
    },
    getNumber() {
      const max = (() => {
        switch (this.mode) {
          case "easy": return 99;
          case "medium": return 999;
          case "hard": return 9999;
          default: return 99;
        }})();

      const number = Math.floor(Math.random() * max);
      console.log(number);

      return number;
    },
    start() {
      const msg = new SpeechSynthesisUtterance();
      msg.text = this.number = this.getNumber();
      msg.volume = 100;
      msg.rate = 1;
      msg.pitch = 1;
      msg.voice = getVoice(this.voice);


      msg.onend = (event) => {
        this.tick();
        this.intervalId = setInterval(this.tick, 1000);
      };

      speechSynthesis.speak(msg);
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
