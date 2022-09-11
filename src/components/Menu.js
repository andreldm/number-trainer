export default {
    name: 'Menu',
    methods: {
      start() {
        this.$router.push('/app')
      },
    },
    template:
        `
            <button class="start-btn" v-on:click="start()">Start</button>
        `
};
