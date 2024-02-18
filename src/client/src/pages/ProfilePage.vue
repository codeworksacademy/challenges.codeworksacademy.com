<template>
  <div class="container-fluid" v-if="profile || account.id">
    <section class="row dark-blue-bg">
      <div class="col-12 p-0">
        <img class="coverImg-style" :src="account.coverImg" alt="Cover Image">
      </div>

      <div class="col-12 text-white mb-3">
        <SummarySection :profile="account" :milestones="milestones" :challenges="challenges"
          :participation="participation" />
      </div>
    </section>

    <section class="row">
      <div class="col-12 col-lg-3">
        <ProfileLinksCard />
      </div>

      <div class="col-12 col-lg-9 pe-lg-4">
        <router-view />
      </div>
    </section>
  </div>

  <div class="container-fluid" v-else>
    <h1 class="fs-1 fw-bold">
      Loading... <i class="mdi mdi-loading mdi-spin"></i>
    </h1>
  </div>
</template>


<script>
import { computed, } from 'vue'
import { AppState } from '../AppState';
import AccountModerator from "../components/AccountModerator.vue";
import ChallengeCard from '../components/ChallengesPage/ChallengeCard.vue'
import SummarySection from '../components/ProfilePage/SummarySection.vue';
import ProfileLinksCard from '../components/ProfilePage/ProfileLinksCard.vue';

export default {
  components: { ChallengeCard, AccountModerator, SummarySection, ProfileLinksCard },
  setup() {

    return {
      account: computed(() => AppState.AccountState.account),
      challenges: computed(() => AppState.AccountState.challenges),
      participation: computed(() => AppState.AccountState.participation),
      milestones: computed(() => AppState.AccountState.milestones),

      // profile: computed(() => AppState.ProfileState.profile),
      // challenges: computed(() => AppState.ProfileState.challenges),
      // participation: computed(() => AppState.ProfileState.participation),
      // milestones: computed(() => AppState.ProfileState.milestones),

    };
  }
}
</script>

<style scoped>
.modal-body {
  background-color: #151d2b;
}

.modal-header {
  background-color: #151d2b;
}

.coverImg-style {
  object-fit: cover;
  object-position: center;
  height: 12vh;
  width: 100%;
}

.dark-blue-bg {
  background-color: #0E131B;
}

.aqua-btn-outline {
  border: 1px solid #00CCE6;
  color: #00CCE6;
}

.aqua-btn-outline:hover {
  background-color: #00CCE6;
  color: black;
}
</style>