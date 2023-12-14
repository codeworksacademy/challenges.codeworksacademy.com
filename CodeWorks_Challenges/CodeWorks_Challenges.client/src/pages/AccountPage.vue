<template>
  <div class="container-fluid" v-if="account.id">
    <section class="row dark-blue-bg">
      <div class="p-0">
        <img class="coverImg-style" :src="account.coverImg" alt="Cover Image">
      </div>

      <div class="col-12 text-white">
        <section class="row">
          <div class="col-12 col-md-8 d-flex summary-height">
            <img :src="account.picture" :alt="account.name" class="avatar-lg mx-4 light-gold-border avatar-style">
            <div class="d-flex flex-column">
              <p class="fs-2 m-0">
                {{ account.name }}
              </p>
              <p class="fs-6 d-none d-md-block">
                <span class="light-gold-color">Rank: </span> {{ currentRank }}
                <span title="experience" class="ms-4">
                  {{ account.rank }} <span class="light-gold-color">XP</span>
                </span>
                <span title="challenges" class="ms-4">
                  {{ (myChallenges.length + joinedChallenges.length) }}
                  <i class="mdi mdi-file-code light-gold-color"></i>
                </span>
                <span title="reputation" class="ms-4">
                  {{ account.reputation }} <i class="mdi light-gold-color mdi-emoticon-happy"></i>
                </span>
              </p>
            </div>
          </div>

          <div class="col-md-4 align-items-center justify-content-end d-none d-md-flex summary-height">
            <router-link :to="{name: 'Account Challenges'}">
              <button class="btn aqua-btn-outline mx-4 my-2">
                View my challenges
              </button>
            </router-link>
          </div>
        </section>
      </div>
    </section>

    <section class="row">
      <div class="col-md-3 col-12">
        <div class="my-3 mx-1 px-3 py-2 user-links-card rounded d-flex flex-column">
          <p class="text-white-50">
            User Links
          </p>
          <div class="text-white d-flex flex-column border-bottom border-dark">
            <div class="user-links-btn rounded">
              <router-link :to="{name: 'Account Overview'}">
                <button class="btn text-white link-btn">
                  <i class="mdi mdi-layers"></i> Overview
                </button>
              </router-link>
            </div>
            <div class="user-links-btn rounded">
              <router-link :to="{name: 'Account Challenges'}">
                <button class="btn text-white link-btn">
                  <i class="mdi mdi-file-code"></i> Challenges
                </button>
              </router-link>
            </div>
            <div class="user-links-btn rounded">
              <router-link :to="{name: 'Account Badges'}">
                <button class="btn text-white link-btn">
                  <i class="mdi mdi-seal"></i> Badges
                </button>
              </router-link>
            </div>
          </div>
          <div class="user-links-btn rounded">
            <button class="btn text-white link-btn" data-bs-toggle="modal" data-bs-target="#accountFormModal">
              <i class="mdi mdi-account-edit"></i> Edit Account
            </button>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-9">
        <router-view></router-view>
      </div>
    </section>

    <!-- <section class="row mb-3">
      <div class="col-12">
        <h4>
          Challenges Owned:
        </h4>
        <h5 v-if="myChallenges.length === 0">You haven't made any challenges</h5>
        <div v-else v-for="challenge in myChallenges" :key="challenge.id" class="col-12 mb-1 position-relative">
          <ChallengeCard :challenge="challenge" />
        </div>
      </div>
    </section>

    <section class="row mb-3">
      <AccountModerator />
    </section>

    <section class="row mb-3">
      <div class="col-12">
        <h4>
          Challenges Joined:
        </h4>
        <h5 v-if="joinedChallenges.length === 0">You haven't joined any challenges</h5>
        <div v-else v-for="challenge in joinedChallenges" :key="challenge.id" class="mb-1">
          <ChallengeCard :challenge="challenge.challenge" />
        </div>
      </div>
    </section>

    <section class="row mb-3">
      <div class="col-12">
        <h4>
          Challenges Completed:
        </h4>
        <h5 v-if="completedChallenges.length === 0">You haven't completed any challenges</h5>
        <div v-else v-for="challenge in completedChallenges" :key="challenge.id">
          <ChallengeCard :challenge="challenge" />
        </div>
      </div>
    </section> -->

    <section class="row my-2">
      <!-- <MilestonesTracker /> -->
    </section>
  </div>

  <div class="container-fluid" v-else>
    <h1 class="fs-1 fw-bold">
      Loading... <i class="mdi mdi-loading mdi-spin"></i>
    </h1>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="accountFormModal" tabindex="-1" aria-labelledby="accountFormModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="accountFormModalLabel">Edit Account</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <AccountForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watchEffect } from 'vue'
import { AppState } from '../AppState';
import AccountForm from "../components/AccountForm.vue";
import Pop from "../utils/Pop.js";
import { challengesService } from "../services/ChallengesService.js";
import { logger } from "../utils/Logger.js";
import ChallengeCard from '../components/ChallengeCard.vue'
import AccountModerator from "../components/AccountModerator.vue";
import { accountService } from "../services/AccountService.js";
import { useRoute } from 'vue-router';
import { profilesService } from "../services/ProfilesService.js";
import MilestonesTracker from "../components/MilestonesTracker.vue";

export default {
  setup() {
    const route = useRoute()

    async function getParticipantsByAccount() {
      try {
        await accountService.getMyParticipations()
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }

    async function getMyChallenges() {
      try {
        logger.log(AppState.account.id)
        await challengesService.getMyChallenges(AppState.account.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }

    watchEffect(() => {
      if (AppState.account.id) {
        getParticipantsByAccount()
        getMyChallenges()
      }
    })
    return {
      account: computed(() => AppState.account),
      joinedChallenges: computed(() => AppState.myParticipants),
      myChallenges: computed(() => AppState.myChallenges)
    };
  },
  components: { AccountForm, ChallengeCard, AccountModerator, MilestonesTracker }
}
</script>

<style scoped>
.summary-height{
  height: 9vh;
}

.coverImg-style {
  object-fit: cover;
  object-position: center;
  height: 12vh;
  width: 100%;
}

.avatar-style {
  position: relative;
  top: -5.5vh;
}

.dark-blue-bg{
  background-color: #0E131B;
}

.user-links-card{
  background-color: #0E141E;
}

.user-links-btn:hover{
  background-color: #0B0E13;
}

.aqua-btn-outline{
  border: 1px solid #00CCE6;
  color: #00CCE6;
}
.aqua-btn-outline:hover{
  background-color: #00CCE6;
  color: black;
}

.link-btn:focus{
  border: 1px solid #0B0E13;
}

@media (min-width: 768px) {
  .user-links-card{
  background-color: #0E141E;
  width: 15rem;
}
}
</style>