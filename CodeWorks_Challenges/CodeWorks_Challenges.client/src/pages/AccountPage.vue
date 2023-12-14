<template>
  <div class="container-fluid" v-if="account.id">
    <section class="row dark-blue-bg">
      <div class="p-0">
        <img class="coverImg-style" :src="account.coverImg" alt="Cover Image">
      </div>

      <div class="col-12 text-white">
        <section class="row">
          <div class="col-12 col-md-8 d-flex summary-height">
            <SummarySection :name="account.name" :picture="account.picture" :rank="account.rank" :challengesCount="myChallenges.length.toString()" :reputation="account.reputation" />
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
        <UserLinksCard />
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
import { computed, watchEffect } from 'vue'
import { AppState } from '../AppState';
import AccountForm from "../components/AccountForm.vue";
import Pop from "../utils/Pop.js";
import { challengesService } from "../services/ChallengesService.js";
import { logger } from "../utils/Logger.js";
import ChallengeCard from '../components/ChallengeCard.vue'
import AccountModerator from "../components/AccountModerator.vue";
import { accountService } from "../services/AccountService.js";
import UserLinksCard from '../components/AccountAndProfilePage/UserLinksCard.vue';
import SummarySection from '../components/AccountAndProfilePage/SummarySection.vue';

export default {
  setup() {
    async function getMyParticipations() {
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
        getMyParticipations()
        getMyChallenges()
      }
    })
    return {
      account: computed(() => AppState.account),
      myChallenges: computed(() => AppState.myChallenges)
    };
  },
  components: { AccountForm, ChallengeCard, AccountModerator, UserLinksCard, SummarySection }
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