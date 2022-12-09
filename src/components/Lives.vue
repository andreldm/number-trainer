<script>
export default {
  name: "Lives",
  props: {
    lives: Number,
  },
};
</script>

<template>
  <div class="hearts">
    <span v-bind:class="{ broken: lives <= 0 }" class="heart"></span>
    <span v-bind:class="{ broken: lives <= 1 }" class="heart"></span>
    <span v-bind:class="{ broken: lives <= 2 }" class="heart"></span>
  </div>
</template>

<style>
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
</style>
