<template>
  <div class="container">
    <section class="row pt-3">
      <div class="col-12 bg-success position-relative">
        <img style="z-index: -1;" class="cover-image rounded position-absolute" :src="account.coverImg" alt="">
      </div>

      <div class="col-12">
        <div class="account d-flex flex-column align-items-center justify-content-center">
          <h1>Welcome {{ account.name }}</h1>
          <img class="rounded" :src="account.picture" :alt="account.name" />

        </div>
        <div class="about text-center mt-3">
          <h2>{{ account.email }}</h2>
          <p>About: {{ account.aboutContent }}</p>

          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#accountFormModal">
            Edit Account
          </button>
        </div>
      </div>

    </section>

    <section class="row">
      <h2 class="col-6">
        Reputation:
        <h3 v-if="account.reputation === 0">You don't have any reputation</h3>
        <h3 v-else>{{ account.reputation }}</h3>
      </h2>
      <h2 class="col-6">
        Rank:
        <h3 v-if="account.rank === 0">New Challenger</h3>
        <h3 v-else>{{ account.reputation }}</h3>
      </h2>
    </section>

    <section class="row">
      <MilestonesTracker />
    </section>

    <section class="row">
      <h2 class="col-12">
        Challenges Owned:
        <h3 v-if="myChallenges.length === 0">You haven't made any challenges</h3>
        <div v-else v-for="challenge in myChallenges" :key="challenge.id" class="col-12 mb-1 position-relative">
          <ChallengeCard :challenge="challenge" />
        </div>
      </h2>
    </section>

    <section class="row">
      <AccountModerator />
    </section>

    <section class="row">
      <h2 class="col-12">
        Challenges Joined:
        <h3 v-if="joinedChallenges.length === 0">You haven't joined any challenges</h3>
        <div v-else v-for="challenge in joinedChallenges" :key="challenge.id" class="mb-1">
          <ChallengeCard :challenge="challenge.challenge" />
        </div>
      </h2>
    </section>

    <section class="row">
      <h2 class="col-12">
        Challenges Completed:
        <h3 v-if="completedChallenges.length === 0">You haven't completed any challenges</h3>
        <div v-else v-for="challenge in completedChallenges" :key="challenge.id">
          <ChallengeCard :challenge="challenge" />
        </div>
      </h2>
    </section>

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
import { computed, onMounted, watchEffect } from 'vue'
import { AppState } from '../AppState';
import AccountForm from "../components/AccountForm.vue";
import Pop from "../utils/Pop.js";
import { challengesService } from "../services/ChallengesService.js";
import { logger } from "../utils/Logger.js";
import ChallengeCard from '../components/ChallengeCard.vue'
import { moderatorsService } from "../services/ModeratorsService.js";
import AccountModerator from "../components/AccountModerator.vue";
import { participantsService } from "../services/ParticipantsService.js";
import { accountService } from "../services/AccountService.js";
export default {
  setup() {
    async function getMyChallenges() {
      try {
        logger.log(AppState.account.id)
        await challengesService.getMyChallenges(AppState.account.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }

    async function getMyBadges() {
      // try {
      //   await badgesService.getMyBadges(AppState.account.id)
      // } catch (error) {
      //   Pop.toast(error, 'error')
      // }
    }

    // async function getMyJoinedChallenges() {
    // try {
    //   await challengesService.getMyJoinedChallenges(AppState.account.id)
    // } catch (error) {
    //   Pop.toast(error, 'error')
    // }
    // }

    async function getParticipantsByAccount() {
      try {
        await accountService.getMyParticipations()
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }

    watchEffect(() => {
      if (AppState.account.id) {
        getMyChallenges()
        getMyBadges()
        // getMyJoinedChallenges()
        getParticipantsByAccount()
      }
    })
    return {
      account: computed(() => AppState.account),
      myChallenges: computed(() => AppState.myChallenges),
      joinedChallenges: computed(() => AppState.myParticipants),
      completedChallenges: computed(() => []),
    };
  },
  components: { AccountForm, ChallengeCard, AccountModerator }
}
</script>

<style scoped>
h2 {
  margin-bottom: 32px;
}

h3 {
  margin-top: 16px;
}

img {
  max-width: 100px;
}

.row {
  font-weight: bold;
  margin-bottom: 16px;
}

.cover-image {
  height: 40vh;
  min-width: 100%;
  object-fit: cover;
  object-position: center;
}

.account {
  min-height: 40vh;
}
</style>
