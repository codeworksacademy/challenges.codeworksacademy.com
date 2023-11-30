<template>
  <header>
    <Navbar class="sticky-top"/>
    <section class="container-fluid">
      <div class="d-flex flex-row">
      </div>
    </section>
    <OffCanvasMenu>
      <router-view />
    </OffCanvasMenu>
  </header>
  <main>
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
  <footer class="bg-dark text-light">
    Made with 💖 by CodeWorks
  </footer>


</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ModalWrapper from './components/ModalWrapper.vue'
import CreateChallengeForm from './components/CreateChallengeForm.vue'
import ChallengeSubmissionForm from './components/ChallengeSubmissionForm.vue'
import OffCanvasMenu from './components/OffCanvasMenu.vue'
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
    OffCanvasMenu,
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

:root{
  --main-height: calc(100vh - 32px - 64px);
}


footer {
  display: grid;
  place-content: center;
  height: 32px;
}

.avatar-xs{
  height: 3rem;
  width: 3rem;
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

.avatar-md{
  height: 6rem;
  width: 6rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

</style>