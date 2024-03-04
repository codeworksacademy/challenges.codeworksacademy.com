<template>
  <div class="container-fluid">
    <section class="row align-items-center py-3 mt-3 border-underline dark-blue-bg rounded-top">
      <div class="col-12 d-flex align-items-center flex-wrap">
        <div class="dropdown my-1 me-3">
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
        <p class="mb-0 ms-auto text-white d-none d-md-block">
          <em>
            {{
              moderationTypes == 'My Moderations'
              ? 'Challenges you moderate for other people'
              : 'Moderators for your challenges'
            }}
          </em>
        </p>
        <p class="my-1 mb-0 ms-auto text-white">
          {{ moderationTypes || 'MY MODERATIONS' }}:
          <span class="highlight-text fw-semibold me-md-2">{{ moderations?.length }}</span>
        </p>
      </div>
    </section>

    <section class="row border-underline text-white-50 mt-3">
      <div class="col-4">
        <p title="challenge" class="text-truncate">
          CHALLENGE
        </p>
      </div>
      <div class="col-4">
        <p title="profile">
          PROFILE
        </p>
      </div>
      <div class="col-2">
        <p title="status">
          STATUS
        </p>
      </div>
      <div class="col-2 text-center">
        <p title="remove moderator role" class="text-truncate">
          {{ moderationTypes == 'My Moderations' ? 'UNMOD SELF' : 'REMOVE MOD' }}
        </p>
      </div>
    </section>
    <section class="row" v-if="moderations?.length > 0">
      <div class="col-12 p-0" v-for="moderation in moderations">
        <ModerationCard :moderationProp="moderation" :moderationTypes="moderationTypes" />
      </div>
    </section>
    <section class="row" v-else>
      <div class="col-12 d-none d-md-block py-5 px-3">None found</div>
      <div class="col-12 d-block d-md-none p-5 text-center">None found</div>
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
    const moderationTypes = ref('My Moderations');

    const route = useRoute();
    const router = useRouter();
    function accountCheck() {
      if (!AppState.AccountState.account.id) { // give time for account to login
        logger.log('[AUTH-CHECK] loop trigger, no ID:', AppState.AccountState.account.id);
        setTimeout(() => accountCheck(), 200);
        return
      }
      if (route.params.profileId != AppState.AccountState.account.id) {
        Pop.error('[UNAUTHORIZED ACCESS] Profile Moderations Page');
        router.push({ name: 'Error' });
      }
    }
    onMounted(() => { accountCheck(); })

    return {
      moderationTypes,
      moderations: computed(() => {
        if (moderationTypes.value == 'My Moderations') {
          return AppState.AccountState?.moderation?.filter(m => m.challenge.creatorId != AppState.AccountState.account.id);
        }
        else if (moderationTypes.value == 'Challenge Moderators') {
          return AppState.AccountState.challengeModerations.filter(m => m.accountId != AppState.AccountState.account.id);
        }
      }),
    }
  },
  components: { ModerationCard }
}
</script>


<style lang="scss" scoped>
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