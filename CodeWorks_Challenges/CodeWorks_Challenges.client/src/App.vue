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

    <BottomOffcanvasWrapper id="moderatorsOffcanvas">
      <template #header>
        <h3 class="m-auto">
          Challenge Moderators:
        </h3>
      </template>
      <template #body>
        <div  class="col-12 d-flex justify-content-center align-items-center">
          <div class="col-2 p-3"  v-for="m in moderators" :key="m.id">
            <ModeratorCard :moderator="m" />
          </div>
        </div>
      </template>
    </BottomOffcanvasWrapper>
  </main>

</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ModalWrapper from './components/ModalWrapper.vue'
import CreateChallengeForm from './components/CreateChallengeForm.vue'
import ChallengeSubmissionForm from './components/ChallengeSubmissionForm.vue'
import BottomOffcanvasWrapper from './components/BottomOffcanvasWrapper.vue'
import ModeratorCard from './components/ModeratorCard.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState),
      participants: computed(() => AppState.participants),
      moderators: computed(() => AppState.moderators),
    }
  },
  components: { 
    Navbar,
    ModalWrapper,
    CreateChallengeForm,
    ChallengeSubmissionForm,
    BottomOffcanvasWrapper,
    ModeratorCard,
  }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";
@import url('https://fonts.googleapis.com/css2?family=Lekton:wght@400;700&display=swap');

:root{
  --main-height: calc(100vh - 32px - 64px);
}

header{
  background-color: #0B0E13;
}

main{
  background-color: #141D2B;
}

.avatar-xs{
  height: 2.75rem;
  width: 2.75rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.avatar-sm{
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.avatar-lg{
  height: 7rem;
  width: 7rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

</style>