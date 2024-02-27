<template>
  <header>
    <Navbar />
  </header>

  <main>
    <router-view />
  </main>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ModeratorCard from './components/ModeratorCard.vue'


export default {
  setup() {
    return {
      appState: computed(() => AppState),
      participants: computed(() => AppState.ChallengeState.participants),
      moderators: computed(() => AppState.ChallengeState.moderators),
    }
  },
  components: {
    Navbar,
    ModeratorCard,
  }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

:root {
  --main-height: calc(100vh - 32px - 64px);
}

header {
  background-color: var(--bg-sub);
  // background-color: #0B0E13;
}

main {
  background-color: var(--bg-main);
  // background-color: #141D2B;
}

.modal {
  z-index: 4001;
}

.avatar-xs {
  height: 2.75rem;
  width: 2.75rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.avatar-sm {
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.avatar-lg {
  height: 7rem;
  width: 7rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.light-gold-color {
  color: #CBD4A5;
}

.light-gold-border {
  border: 3px solid #CBD4A5;
}

.swal2-container {
  z-index: 9001; // default of 1060
}
</style>