<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
  </main>
   <footer class="bg-dark text-light">
    Made with 💖 by CodeWorks
  </footer>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { Navbar }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

body, html {
  background: #121722;
  background-image: url(./assets/img/bg-main.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  overflow-x: hidden;
  height: 100vh;
  width: 100vw;
}

:root{
  --main-height: calc(100vh - 32px - 64px);
}


footer {
  display: grid;
  place-content: center;
  height: 32px;
}
</style>
