<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
    <ModalWrapper id="submitChallengeForm">
      <SubmitChallengeForm />
    </ModalWrapper>

    <ModalWrapper id="submitAnswerModal" class="w-75 h-50 rounded d-flex justify-content-center align-items-center m-3">
      <template #header>
        <h3>
          Submit Answer
        </h3>
      </template>
      <template #body>
        <AnswerForm />
      </template>
    </ModalWrapper>
  </main>
   <footer class="bg-dark text-light">
    Made with 💖 by CodeWorks
  </footer>

</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ModalWrapper from './components/ModalWrapper.vue'
import SubmitChallengeForm from './components/SubmitChallengeForm.vue'
import AnswerForm from './components/AnswerForm.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { 
    Navbar,
    ModalWrapper,
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
