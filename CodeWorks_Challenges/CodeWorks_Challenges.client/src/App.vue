<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
    <ChallengeModal id="submitChallengeForm">
      <SubmitChallengeForm />
    </ChallengeModal>
  </main>
   <footer class="bg-dark text-light">
    Made with 💖 by CodeWorks
  </footer>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ChallengeModal from './components/ChallengeModal.vue'
import SubmitChallengeForm from './components/SubmitChallengeForm.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { 
    Navbar,
    ChallengeModal,
    SubmitChallengeForm }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

:root{
  --main-height: calc(100vh - 32px - 64px);
}


footer {
  display: grid;
  place-content: center;
  height: 32px;
}
</style>
