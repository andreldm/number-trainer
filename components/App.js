import Lives from './Lives.js';
import { getVoice } from '../util.js';

export default {
    name: 'App',
    components: {
        Lives,
    },
    props: {
      mode: String,
      voice: String
    },
    data() {
      return {
        lives: 3,
        score: -1,
        error: false,
        number: undefined,
        guess: undefined,
        intervalId: undefined,
        timeLeft: 0
      }
    },
    methods: {
      tick() {
        if (--this.timeLeft == 0) {
          this.lives--;
          clearInterval(this.intervalId);
        }
      },
      getNumber() {
        const max =
          this.mode == 'easy' ? 99 :
          this.mode == 'medium' ? 999 :
          this.mode == 'hard' ? 9999 : 99;

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

        if (this.score < 0)
          this.score = 0;
  
        msg.onend = (event) => {
          this.tick();
          this.intervalId = setInterval(this.tick, 1000);
        };

        speechSynthesis.speak(msg);
        this.timeLeft = 6;
        document.querySelector(".number-input").focus();
      },
      check() {
        console.log(this.guess == this.number);
  
        if (this.guess == this.number) {
          this.score++;
        } else {
          this.lives--;
          this.error = true;
          setTimeout(() => this.error = false, 500);
        }
  
        clearInterval(this.intervalId);
        this.guess = "";
        this.start();
      },
      back() {
        this.$router.push('/');
      },
    },
    template:
        `
            <Lives :lives="lives"/>
            <span class="back"
                  v-on:click="back()">&#10799;</span>
            <button class="button circle play"
                    v-bind:disabled="timeLeft > 0"
                    v-on:click="start()"></button>
            <input class="number-input"
                   v-bind:class="{ error: error }"
                   type="text"
                   inputmode="numeric"
                   pattern="[0-9]*"
                   v-model="guess"
                   @keyup.enter="check()">
            <progress class="progress"
                      v-bind:class="{ hidden: timeLeft == 0 }"
                      v-bind:value="timeLeft - 1"
                      max="5"></progress>
            <div class="score"
                 v-bind:class="{ hidden: score < 0 }">{{score}}</div>
        `
};
