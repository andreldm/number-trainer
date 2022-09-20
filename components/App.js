import Lives from './Lives.js';

export default {
    name: 'App',
    components: {
        Lives,
    },
    data() {
      return {
        lives: 3,
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
      start() {
        this.number = Math.floor(Math.random() * 100);
        console.log(this.number);
  
        const msg = new SpeechSynthesisUtterance();
        msg.text = this.number;
        msg.volume = 100;
        msg.rate = 1;
        msg.pitch = 1;
        msg.voice = speechSynthesis.getVoices().filter((v) => v.lang == 'en-US')[0];
  
        window.speechSynthesis.speak(msg);
  
        this.timeLeft = 6;
        this.intervalId = setInterval(this.tick, 1000);
  
        document.querySelector(".number-input").focus()
      },
      check() {
        console.log(this.guess == this.number);
  
        if (this.guess == this.number) {
  
        } else {
          this.lives--;
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
            <span class="back"  v-on:click="back()">&#10799;</span>
            <button class="button circle play" v-bind:disabled="timeLeft > 0" v-on:click="start()"></button>
            <input inputmode="numeric" pattern="[0-9]*" type="text" class="number-input" v-model="guess" @keyup.enter="check()">
            <progress class="progress" v-bind:class="{ hidden: timeLeft == 0 }" v-bind:value="timeLeft - 1" max="5"></progress>
        `
};
