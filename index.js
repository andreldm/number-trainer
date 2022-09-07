const app = Vue.createApp({
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
    }
  }
});

app.mount('#app');

