<script>
import { getVoices } from "../util.js";
import { Keys, loadScore, loadPreference, savePreference } from "../persistence.js";

export default {
  name: "Menu",
  data() {
    return {
      mode: loadPreference(Keys.LAST_MODE, ''),
      voice: loadPreference(Keys.LAST_VOICE, ''),
      voices: [],
    };
  },
  mounted() {
    getVoices(voices => this.voices = voices);
  },
  methods: {
    start() {
      this.$router.push(`/main/${this.mode}/${this.voice}`);
    },
    preferences() {
      this.$router.push(`/preferences`);
    }
  },
  watch: {
    mode: (value) => { savePreference(Keys.LAST_MODE, value) },
    voice: (value) => { savePreference(Keys.LAST_VOICE, value) },
  },
  computed: {
    bestScore() {
      return loadScore(this.mode, this.voice);
    }
  }
};
</script>

<template>
  <span class="preferences" v-on:click="preferences()"></span>
  <h1 class="title">Number Trainer</h1>

  <span class="button-group">
    <button
      class="button"
      v-bind:class="{ selected: mode == 'easy' }"
      v-on:click="this.mode = 'easy'"
    >
      <div>Easy</div>
      <div class="small">0-99</div>
    </button>
    <button
      class="button"
      v-bind:class="{ selected: mode == 'medium' }"
      v-on:click="this.mode ='medium'"
    >
      <div>Medium</div>
      <div class="small">0-999</div>
    </button>
    <button
      class="button"
      v-bind:class="{ selected: mode == 'hard' }"
      v-on:click="this.mode = 'hard'"
    >
      <div>Hard</div>
      <div class="small">0-9999</div>
    </button>
  </span>

  <select class="select" v-model="voice" label="labels">
    <option disabled value="">{{ voices.length == 0 ? "Loading voices..." : "Please select voice" }}</option>
    <option v-for="v in voices" v-bind:value="v.name">
      {{ v.name }} ({{ v.lang }})
    </option>
  </select>

  <button
    class="button"
    v-bind:disabled="mode == undefined || voice == ''"
    v-on:click="start()"
  >
    Start
  </button>

  <div v-show="bestScore > 0">Best Score is {{ bestScore }}</div>
</template>

<style scoped>
.title {
  top: 0;
  margin-top: 0;
  padding: 0;
  font-size: 2.4rem;
  font-weight: 600;
}

@media (hover: hover) and (pointer: fine) {
  .button:hover:enabled {
    background-color: var(--primary-color);
    filter: brightness(120%);
  }
}
.button-group .button {
  border-radius: 0;
  margin: 0;
  font-size: 1.5rem;
  min-width: 6.5rem;
}
.button-group .button:first-child {
  border-top-left-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
}
.button-group .button:last-child {
  border-top-right-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
}
.button-group .button.selected {
  background-color: var(--primary-color-darker);
}

.small {
  font-size: 0.5em;
}

.select {
  min-width: 16rem;
  max-width: 18rem;
  -webkit-appearance: none;
  appearance: none;
  text-align-last:center;
  border: 0.2rem solid var(--primary-color);
  border-radius: 0.3rem;
  padding: 0.25em 0.5em;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: var(--primary-color);
  color: #fff;
  font-weight: 600;
}

.preferences {
  margin-top: 1rem;
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmVyc2lvbj0iMS4xIgogICBoZWlnaHQ9IjMwIgogICB3aWR0aD0iMjkuOTk5OTk4IgogICBpZD0ic3ZnMTMiCiAgIHNvZGlwb2RpOmRvY25hbWU9InByZWZlcmVuY2VzLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4zICgwZTE1MGVkNmM0LCAyMDIzLTA3LTIxKSIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzE1IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSIKICAgICBzaG93Z3JpZD0idHJ1ZSIKICAgICBpbmtzY2FwZTp6b29tPSIyMi42Mjc0MTciCiAgICAgaW5rc2NhcGU6Y3g9IjkuMDM3NzA4NiIKICAgICBpbmtzY2FwZTpjeT0iMTQuNTg0MDc3IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDYwIgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMTMiCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSIKICAgICBpbmtzY2FwZTpsb2NrZ3VpZGVzPSJmYWxzZSI+PGlua3NjYXBlOmdyaWQKICAgICAgIGlkPSJncmlkMiIKICAgICAgIHVuaXRzPSJweCIKICAgICAgIG9yaWdpbng9IjAiCiAgICAgICBvcmlnaW55PSIwIgogICAgICAgc3BhY2luZ3g9IjAuNSIKICAgICAgIHNwYWNpbmd5PSIwLjUiCiAgICAgICBlbXBjb2xvcj0iIzAwOTllNSIKICAgICAgIGVtcG9wYWNpdHk9IjAuMzAxOTYwNzgiCiAgICAgICBjb2xvcj0iIzAwOTllNSIKICAgICAgIG9wYWNpdHk9IjAuMTQ5MDE5NjEiCiAgICAgICBlbXBzcGFjaW5nPSI1IgogICAgICAgZG90dGVkPSJmYWxzZSIKICAgICAgIGdyaWRhbmdsZXg9IjMwIgogICAgICAgZ3JpZGFuZ2xlej0iMzAiCiAgICAgICB2aXNpYmxlPSJ0cnVlIiAvPjwvc29kaXBvZGk6bmFtZWR2aWV3PjxkZWZzCiAgICAgaWQ9ImRlZnM3Ij48c3R5bGUKICAgICAgIHR5cGU9InRleHQvY3NzIgogICAgICAgaWQ9InN0eWxlMiI+PCFbQ0RBVEFbCiAgICAub3V0bGluZSB7IHN0cm9rZTpub25lOyBzdHJva2Utd2lkdGg6MCB9CiAgXV0+PC9zdHlsZT48ZwogICAgICAgaWQ9ImhlYXJ0Ij48cGF0aAogICAgICAgICBkPSJNIDAsMjAwIFYgMCBoIDIwMCBhIDEwMCwxMDAgOTAgMCAxIDAsMjAwIDEwMCwxMDAgOTAgMCAxIC0yMDAsMCB6IgogICAgICAgICBpZD0icGF0aDQiIC8+PC9nPjwvZGVmcz48cGF0aAogICAgIGlkPSJwYXRoMSIKICAgICBzdHlsZT0iZmlsbDojMmI5N2EzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMmI5N2EzO3N0cm9rZS13aWR0aDowO3N0cm9rZS1saW5lam9pbjpiZXZlbDtzdHJva2UtZGFzaGFycmF5Om5vbmU7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIKICAgICBkPSJNIDExLjk5OTk5OSwwIFYgNC4xOTkyMTg4IEwgOS41OTk2MDg0LDUuNDAwMzkwNiA1Ljk5OTk5OSwxLjgwMDc4MTIgMS44MDA3ODAyLDYgNS40MDAzODk2LDkuNTk5NjA5NCA0LjE5OTIxNzgsMTIgSCAtOS41MzY3NDMyZS03IHYgNiBIIDQuMTk5MjE3OCBMIDUuNDAwMzg5NiwyMC40MDAzOTEgMS44MDA3ODAyLDI0IGwgMy41OTk2MDk0LDQuMTk5MjE5IDQuMTk5MjE4OCwtMy41OTk2MSAyLjQwMDM5MDYsMS4yMDExNzIgViAzMCBoIDYgdiAtNC4xOTkyMTkgbCAyLjQwMDM5MSwtMS4yMDExNzIgYyAtMC4wODI1LC0wLjA4MjUxIDIuNzk5MjIsMi4xOTk2MTEgNC4xOTkyMTgsMy41OTk2MSBMIDI4LjE5OTIxOCwyNCAyNC41OTk2MDgsMjAuNDAwMzkxIDI1LjgwMDc4LDE4IGggNC4xOTkyMTkgViAxMiBIIDI1LjgwMDc4IEwgMjQuNTk5NjA4LDkuNTk5NjA5NCAyOC4xOTkyMTgsNiAyMy45OTk5OTksMS44MDA3ODEyIDIwLjQwMDM5LDUuNDAwMzkwNiAxNy45OTk5OTksNC4xOTkyMTg4IFYgMCBaIG0gMywxMCBhIDQuOTk5OTk5NSw0Ljk5OTk5OTUgMCAwIDEgNSw1IDQuOTk5OTk5NSw0Ljk5OTk5OTUgMCAwIDEgLTUsNSA0Ljk5OTk5OTUsNC45OTk5OTk1IDAgMCAxIC01LC01IDQuOTk5OTk5NSw0Ljk5OTk5OTUgMCAwIDEgNSwtNSB6IiAvPjxwYXRoCiAgICAgaWQ9InBhdGgyIgogICAgIHN0eWxlPSJmaWxsOiMyYjk3YTM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMyYjk3YTM7c3Ryb2tlLXdpZHRoOjA7c3Ryb2tlLWxpbmVqb2luOmJldmVsO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIgogICAgIGQ9Im0gMTUsMy42MDAwMDEgYSAxMS40LDExLjQgMCAwIDAgLTExLjQwMDAwMSwxMS40IEEgMTEuNCwxMS40IDAgMCAwIDE1LDI2LjM5OTk5OSAxMS40LDExLjQgMCAwIDAgMjYuMzk5OTk5LDE1LjAwMDAwMSAxMS40LDExLjQgMCAwIDAgMTUsMy42MDAwMDEgWiBtIDAsNiBhIDUuMzk5OTk5OCw1LjM5OTk5OTggMCAwIDEgNS4zOTk5OTksNS40IEEgNS4zOTk5OTk4LDUuMzk5OTk5OCAwIDAgMSAxNSwyMC40IDUuMzk5OTk5OCw1LjM5OTk5OTggMCAwIDEgOS41OTk5OTksMTUuMDAwMDAxIDUuMzk5OTk5OCw1LjM5OTk5OTggMCAwIDEgMTUsOS42MDAwMDEgWiIgLz48L3N2Zz4K");
  width: 1.6rem;
  height: 1.6rem;
  background-size: contain;
  background-repeat: no-repeat;
  margin-left: auto;
  cursor: pointer;
}
</style>