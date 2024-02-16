<template>
  <header style="background: var(--bg-sub);">
    <Navbar />
  </header>

  <main style="background: var(--bg-main);">
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

    <ModalWrapper id="challengeSubmissionForm">
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
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ModalWrapper from './components/ModalWrapper.vue'
import CreateChallengeForm from './components/Forms/CreateChallengeForm.vue'
import ChallengeSubmissionForm from './components/Forms/ChallengeSubmissionForm.vue'
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
    ModalWrapper,
    CreateChallengeForm,
    ChallengeSubmissionForm,
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
  background-color: #0B0E13;
}

main {
  background-color: #141D2B;
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
</style>