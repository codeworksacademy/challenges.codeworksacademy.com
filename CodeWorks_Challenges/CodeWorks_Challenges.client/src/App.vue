<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
    <ModalWrapper id="createChallengeForm">
      <template #header>
        <h3 class="m-auto">
          Create Challenge
        </h3>
      </template>
      <template #body>
        <CreateChallengeForm />
      </template>
    </ModalWrapper>

    <ModalWrapper id="createSubmissionForm">
      <template #header>
        <h3 class="m-auto">
          Submit Challenge
        </h3>
      </template>
      <template #body>
        <ChallengeSubmissionForm />
      </template>
    </ModalWrapper>

  </main>
  <footer class="bg-dark text-light">
    Made with 💖 by CodeWorks
  </footer>

  <ModalWrapper id="submitAnswerModal">
    <template #header>
      <h3>
        Submit Answer
      </h3>
    </template>
    <template #body>
      <AnswerForm />
    </template>
  </ModalWrapper>

</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ModalWrapper from './components/ModalWrapper.vue'
import CreateChallengeForm from './components/CreateChallengeForm.vue'
import ChallengeSubmissionForm from './components/ChallengeSubmissionForm.vue'
import AnswerForm from './components/AnswerForm.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState),
      submission: computed(() => AppState.activeSubmission)
    }
  },
  components: { 
    Navbar,
    ModalWrapper,
    CreateChallengeForm,
    ChallengeSubmissionForm,
   }
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
