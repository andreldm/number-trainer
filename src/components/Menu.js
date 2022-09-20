import { getVoices } from '../util.js';

export default {
    name: 'Menu',
    data() {
      return {
        mode: undefined,
        voice: "",
        voices: []
      }
    },
    mounted() {
      this.voices = getVoices();
    },
    methods: {
      start() {
        this.$router.push(`/app/${this.mode}/${this.voice}`);
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

            <select class="select" v-model="voice" label="labels">
              <option disabled value="">Please select voice</option>
              <option v-for="v in voices" v-bind:value="v.name">{{v.name}} ({{v.lang}})</option>
            </select>

            <button class="button"
                    v-bind:disabled="mode == undefined || voice == ''"
                    v-on:click="start()">Start</button>
        `
};
