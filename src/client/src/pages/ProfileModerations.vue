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
      <div class="col-2 text-center">
        <p title="remove or approve" class="text-truncate">
          REMOVE / APPROVE
        </p>
      </div>
      <div class="col-1 text-center">
        <p title="" class="text-truncate">
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
import Pop from "../utils/Pop.js";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from 'vue';
import { AppState } from '../AppState.js';
import { logger } from "../utils/Logger.js";
import ModerationCard from '../components/ModerationCard.vue';


export default {

  setup() {
    const moderationTypes = ref('My Moderations')

    const route = useRoute();
    const router = useRouter();
    function accountCheck() {
      if (!AppState.AccountState.account.id) { // give time for account to login
        logger.log('[AUTH-CHECK] loop trigger, no ID:', AppState.AccountState.account.id);
        setTimeout(() => accountCheck(), 200);
        return
      }
      // logger.log('[AUTH-CHECK] loop bypass trigger got accountId', AppState.AccountState.account.id);
      // logger.log('[AUTH-CHECK] compare ID route.params.profileId', route.params.profileId);
      if (!(route.params.profileId == AppState.AccountState.account.id)) {
        Pop.error('[UNAUTHORIZED ACCESS] Profile Moderations Page');
        router.push({ name: 'Error' });
      }
    }
    onMounted(() => { accountCheck(); })

    return {
      moderationTypes,
      moderations: computed(() => {
        // if (moderationTypes.value == 'My Moderations') {
        let filterModerators = AppState.ProfileState.moderation.filter((m) => m.challenge.creatorId != AppState.AccountState.account.id)
        return filterModerators
        // } else if (moderationTypes.value == 'Challenge Moderators') {
        //   let moderators = AppState.AccountState.challengeModeration
        //   logger.log('[MODERATORS]', moderators)
        //   let filterModerators = moderators.filter((m) => m.accountId != AppState.AccountState.account.id)
        //   return filterModerators
        // } else {
        //   let filterModerators = AppState.ChallengeState.moderators.filter((m) => m.challenge.creatorId != AppState.AccountState.account.id)
        //   return filterModerators
        // }
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