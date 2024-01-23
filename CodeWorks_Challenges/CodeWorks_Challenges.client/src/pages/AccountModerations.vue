<template>
  <div class="container-fluid">
    <section class="row mt-3">
      <div class="dropdown text-end">
        <button class="btn aqua-btn-outline dropdown-toggle" type="button" data-bs-toggle="dropdown"
          aria-expanded="false">
          Filter Moderations
        </button>
        <ul class="dropdown-menu blue-dropdown">
          <li><button @click="moderationTypes = 'My Moderations'" class="btn dropdown-item">My Moderations</button></li>
          <li><button @click="moderationTypes = 'Challenge Moderators'" class="btn dropdown-item">Challenge
              Moderators</button></li>
        </ul>
      </div>
    </section>

    <section class="row pt-3 mt-3 border-underline dark-blue-bg">
      <div class="col-6">
        <p class="text-white fw-semibold">
          {{ moderationTypes.toUpperCase() || 'MY MODERATIONS' }}
        </p>
      </div>
      <div class="col-2"></div>
      <div class="col-4 text-end">
        <p class="text-white">
          <span class="highlight-text fw-semibold">{{ moderations.length }} </span>
          {{ moderationTypes || 'MY MODERATIONS' }}
        </p>
      </div>
    </section>

    <section class="row border-underline text-white-50 mt-3">
      <div class="col-3">
        <p title="profile">
          PROFILE
        </p>
      </div>
      <div class="col-3">
        <p title="challenge" class="text-truncate">
          CHALLENGE
        </p>
      </div>
      <div class="col-3">
        <p title="status">
          STATUS
        </p>
      </div>
      <div class="col-3 text-center">
        <p title="remove or approve" class="text-truncate">
          REMOVE / APPROVE
        </p>
      </div>
    </section>
    <section class="row">
      <div class="col-12" v-for="moderation in moderations">
        <ModerationCard :moderationProp="moderation" />
      </div>
    </section>
  </div>
</template>


<script>
import { computed, ref } from 'vue';
import { AppState } from '../AppState';
import ModerationCard from '../components/ModerationCard.vue';
import { logger } from "../utils/Logger.js";


export default {

  setup() {
    const moderationTypes = ref('My Moderations')

    return {
      moderationTypes,
      moderations: computed(() => {
        if (moderationTypes.value == 'My Moderations') {
          let moderators = AppState.AccountState.moderation
          let filterModerators = moderators.filter((m) => m.challenge.creatorId != AppState.AccountState.account.id)
          return filterModerators
        } else if (moderationTypes.value == 'Challenge Moderators') {
          let moderators = AppState.ChallengeState.moderators
          logger.log('[MODERATORS]', moderators)
          let filterModerators = moderators.filter((m) => m.accountId != AppState.AccountState.account.id)
          return filterModerators
        } else {
          let filterModerators = AppState.ChallengeState.moderators.filter((m) => m.challenge.creatorId != AppState.AccountState.account.id)
          return filterModerators
        }
      }),
    }
  },
  components: { ModerationCard }
}
</script>


<style lang="scss" scoped>
.border-underline {
  border-bottom: 1px solid #2F3E57;
}

.blue-dropdown {
  background-color: #1A2332;
}

.dark-blue-bg {
  background-color: #0E141E;
}

.dropdown-item {
  color: white;
}

.dropdown-item:hover {
  background-color: #0E141E;
}

.aqua-btn-outline {
  border: 1px solid #00CCE6;
  color: #00CCE6;
}

.aqua-btn-outline:hover {
  background-color: #00CCE6;
  color: black;
}

.highlight-font {
  font-family: 'Lekton', sans-serif;
}
</style>