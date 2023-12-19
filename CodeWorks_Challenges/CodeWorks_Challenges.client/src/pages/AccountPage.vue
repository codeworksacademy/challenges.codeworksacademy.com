<template>
  <div class="container-fluid" v-if="account.id">
    <section class="row dark-blue-bg">
      <div class="p-0">
        <img class="coverImg-style" :src="account.coverImg" alt="Cover Image">
      </div>

      <div class="col-12 text-white">
        <section class="row justify-content-between">
          <div class="col-md-7 col-12 d-flex summary-height">
            <SummarySection :name="account.name" :picture="account.picture" :rankString="account.rank" :challengesCount="(myChallenges.length + approvedModerations.length)" :reputation="account.reputation" :rankInt="account.rank" />
          </div>

          <div class="col-4 align-items-center justify-content-end d-none d-md-flex summary-height">
            <router-link :to="{name: 'Account Challenges'}">
              <button class="btn aqua-btn-outline my-2">
                View my challenges
              </button>
            </router-link>
          </div>
        </section>
      </div>
    </section>

    <section class="row">
      <div class="col-md-3 col-12">
        <AccountLinksCard />
      </div>

      <div class="col-12 col-md-9">
        <router-view></router-view>
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
import { computed, onUnmounted, watchEffect } from 'vue'
import { AppState } from '../AppState';
import Pop from "../utils/Pop.js";
import { challengesService } from "../services/ChallengesService.js";
import { logger } from "../utils/Logger.js";
import ChallengeCard from '../components/ChallengeCard.vue'
import AccountModerator from "../components/AccountModerator.vue";
import { accountService } from "../services/AccountService.js";
import SummarySection from '../components/AccountAndProfilePage/SummarySection.vue';
import { challengeModeratorsService } from '../services/ChallengeModeratorsService';
import AccountLinksCard from '../components/AccountAndProfilePage/AccountLinksCard.vue';
import AccountForm from '../components/AccountAndProfilePage/AccountForm.vue';

export default {
  setup() {
    async function getMyChallenges() {
      try {
        logger.log(AppState.account.id)
        await challengesService.getMyChallenges(AppState.account.id)
      } catch (error) {
        Pop.error(error.message)
      }
    }

    async function getMyParticipations() {
      try {
        await accountService.getMyParticipations()
      } catch (error) {
        Pop.error(error.message)
      }
    }

    async function getMyModerations(){
      try {
        await challengeModeratorsService.getModerationsByProfileId(AppState.account.id)
      } catch (error) {
        Pop.error(error.message)
      }
    }

    function clearSharedVariables(){
      try {
        accountService.clearSharedVariables()
      } catch (error) {
        Pop.error(error.message)
      }
    }

    watchEffect(() => {
      if (AppState.account.id) {
        getMyChallenges()
        getMyParticipations()
        getMyModerations()
      }
    })
    onUnmounted(() => {
      clearSharedVariables()
    })

    return {
      account: computed(() => AppState.account),
      myChallenges: computed(() => AppState.myChallenges),

      approvedModerations: computed(() => {
        const approvedMods = AppState.moderations.filter(m => m.status == 'active' && m.challenge.creatorId != AppState.account.id)

        return approvedMods
      })
    };
  },
  components: { AccountForm, ChallengeCard, AccountModerator, SummarySection, AccountLinksCard, AccountForm }
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

.dark-blue-bg{
  background-color: #0E131B;
}

.aqua-btn-outline{
  border: 1px solid #00CCE6;
  color: #00CCE6;
}

.aqua-btn-outline:hover{
  background-color: #00CCE6;
  color: black;
}
</style>