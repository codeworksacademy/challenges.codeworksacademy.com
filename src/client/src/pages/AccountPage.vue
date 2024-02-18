<template>
  <div class="container-fluid" v-if="account.id">
    <section class="row dark-blue-bg">
      <div class="p-0">
        <img class="coverImg-style" :src="account.coverImg" alt="Cover Image">
      </div>

      <div class=" text-white mb-3">
        <section class="row justify-content-between">
          <div class="col-lg-7  d-flex summary-height">
            <SummarySection :profile="account" :milestones="milestones" :challenges="challenges"
              :participation="participation" />
          </div>

          <div class="col-lg-4 align-items-center justify-content-end d-none d-lg-flex summary-height">
            <router-link :to="{ name: 'Account.challenges' }">
              <button class="btn aqua-btn-outline my-2 me-3">
                View my challenges
              </button>
            </router-link>
          </div>
        </section>
      </div>
    </section>

    <section class="row">
      <div class="col-lg-3 ">
        <AccountLinksCard />
      </div>

      <div class=" col-lg-9">
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
import SummarySection from '../components/AccountAndProfilePage/SummarySection.vue';
import AccountLinksCard from '../components/AccountAndProfilePage/AccountLinksCard.vue';

export default {
  setup() {

    return {
      account: computed(() => AppState.AccountState.account),
      challenges: computed(() => AppState.AccountState.challenges),
      participation: computed(() => AppState.AccountState.participation),
      milestones: computed(() => AppState.AccountState.milestones)
    };
  },
  components: { ChallengeCard, AccountModerator, SummarySection, AccountLinksCard }
}
</script>

<style scoped>
.modal-body {
  background-color: #151d2b;
}

.modal-header {
  background-color: #151d2b;
}

.summary-height {
  height: 9vh;
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