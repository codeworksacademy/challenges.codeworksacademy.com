<template>
  <div class="container-fluid" v-if="account.id">
    <section class="row">
      <div class="p-0">
        <img class="coverImg-style" :src="account.coverImg" alt="Cover Image">
      </div>

      <div class="d-flex col-md-10 col-12">
        <img :src="account.picture" :alt="account.name" class="avatar-md mx-4 avatar-style">
        <div class="d-flex flex-column">
          <p class="fs-2 m-0">
            {{ account.name }}
          </p>
          <p>
            Rank: {{ currentRank }}
            <span class="ms-2">
              {{ account.rank }} XP
            </span>
            <span title="challenges" class="ms-2">
              {{ (myChallenges.length + joinedChallenges.length) }}
              <i class="mdi mdi-head-lightbulb fs-5"></i>
            </span>
          </p>
        </div>
      </div>

      <div class="col-md-2 col-12 text-md-end">
        <button type="button" class="btn btn-primary my-2 ms-md-0 ms-2" data-bs-toggle="modal"
          data-bs-target="#accountFormModal">
          Edit Account
        </button>
      </div>
    </section>

    <!-- TODO Add computed in Style section which sets the width of the progress bar (i.e., percentile based on next rank and current rank) -->
    <section class="rank-card-style bg-dark text-light row m-2 mb-3 p-2 rounded">
      <div class="col-12 fs-2">
        {{ currentRank }}
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-md-3 col-12 d-flex align-items-end">
            <span>
              CURRENT RANK
            </span>
          </div>
          <div class="col-md-9 col-12 text-start text-md-end">
            <span>
              NEXT RANK: {{ nextRank.toUpperCase() }}
            </span>
            <div class="progress" role="progressbar" aria-label="example" aria-valuenow="50" aria-valuemin="0"
              aria-valuemax="100">
              <div class="progress-bar" :style="{ width: rankPercentage }"> {{ rankPercentage }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="row mb-3">
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
    </section>

    <section class="row my-2">
      <div>
        <a class="btn btn-primary" data-bs-toggle="collapse" href="#milestonesTracker" role="button" aria-expanded="false"
          aria-controls="milestonesTrackerToggle">Toggle Milestones Tracker</a>
      </div>
      <div class="collapse" id="milestonesTracker">
        <MilestonesTracker />
      </div>
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
import { computed, onMounted, watchEffect } from 'vue'
import { AppState } from '../AppState';
import AccountForm from "../components/AccountForm.vue";
import Pop from "../utils/Pop.js";
import { challengesService } from "../services/ChallengesService.js";
import { logger } from "../utils/Logger.js";
import ChallengeCard from '../components/ChallengeCard.vue'
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"
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
        getParticipantsByAccount()
      }
    })
    return {
      currentRank: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (AppState.account.rank >= key) {
            lastKey = key
          }
        }

        return AppState.rankTitles[lastKey]
      }),

      rankPercentage: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (AppState.account.rank >= key) {
            lastKey = key
          }
        }

        let keys = Object.keys(AppState.rankTitles)
        let nextIndex = keys.indexOf(lastKey) + 1
        if (nextIndex == -1) {
          return `100%`
        }

        let nextKey = keys[nextIndex]

        let percentage = (AppState.account.rank / nextKey) * 100

        let finalPer = percentage.toFixed(1)

        return `${finalPer}%`
      }),

      nextRank: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (AppState.account.rank >= key) {
            lastKey = key
          }
        }

        let keys = Object.keys(AppState.rankTitles)
        let nextIndex = keys.indexOf(lastKey) + 1
        if (nextIndex == -1) {
          return 'You have reached the last rank!'
        }
        let nextKey = keys[nextIndex]

        return AppState.rankTitles[nextKey]
      }),

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
.rank-card-style {
  height: fit-content;
}

.coverImg-style {
  object-fit: cover;
  object-position: center;
  height: 15vh;
  width: 100%;
}

.avatar-style {
  position: relative;
  top: -5.5vh;
}
</style>
