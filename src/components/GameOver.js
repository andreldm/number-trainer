export default {
    name: 'GameOver',
    props: {
      score: Number
    },
    methods: {
      menu() {
        this.$router.push('/');
      }
    },
    template:
        `
            <h1 class="title">Game Over</h1>
            <div class="subtitle">Your score was</div>
            <div class="score">{{score}}</div>
            <button class="button"
                    v-on:click="menu()">Menu</button>
        `
};
