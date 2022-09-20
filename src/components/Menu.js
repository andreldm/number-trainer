export default {
    name: 'Menu',
    data() {
      return {
        mode: undefined
      }
    },
    methods: {
      start() {
        this.$router.push(`/app/${this.mode}`);
      },
      setMode(mode) {
        this.mode = mode;
      }
    },
    template:
        `
            <span class="button-group">
              <button class="button"
                      v-bind:class="{ selected: mode == 'easy' }"
                      v-on:click="setMode('easy')">
                <div>Easy</div>
                <div class="small">0-99</div>
              </button>
              <button class="button"
                      v-bind:class="{ selected: mode == 'medium' }"
                      v-on:click="setMode('medium')">
                <div>Medium</div>
                <div class="small">0-999</div>
              </button>
              <button class="button"
                      v-bind:class="{ selected: mode == 'hard' }"
                      v-on:click="setMode('hard')">
                <div>Hard</div>
                <div class="small">0-9999</div>
              </button>
            </span>
            <button class="button"
                    v-bind:disabled="mode == undefined"
                    v-on:click="start()">Start</button>
        `
};
