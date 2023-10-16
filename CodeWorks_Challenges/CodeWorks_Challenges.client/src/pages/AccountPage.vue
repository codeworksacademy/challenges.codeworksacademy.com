<template>
  <div class="container">
    <section class="row pt-3">
      <div class="col-12 bg-success position-relative">
        <img style="z-index: -1;" class="cover-image rounded position-absolute" :src="account.coverImage" alt="">
      </div>

      <div class="col-12">
        <div class="account d-flex flex-column align-items-center justify-content-center">
          <h1>Welcome {{ account.name }}</h1>
          <img class="rounded" :src="account.picture" :alt="account.name" />

        </div>
        <div class="about text-center mt-3">
          <h2>{{ account.email }}</h2>
          <p>About: {{ account.aboutContent }}</p>

          <!-- Button trigger modal -->
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Edit Account
          </button>
        </div>
      </div>

    </section>

    <section class="row">
      <h2 class="col-12">
        Reputation:
        <h3 v-if="account.reputation === 0">You don't have any reputation</h3>
        <h3 v-else>{{ account.reputation }}</h3>
      </h2>
    </section>

    <section class="row">
      <h2 class="col-12">
        Badges:
        <h3>You don't have any badges</h3>
      </h2>
    </section>

    <section class="row">
      <h2 class="col-12">
        Challenges Owned:
        <h3 v-if="myChallenges.length === 0">You haven't made any challenges</h3>
        <div v-else v-for="challenge in myChallenges" :key="challenge.id" class="col-12 px-3 mb-1 position-relative">
          <ChallengeCard :challenge="challenge" />
        </div>
      </h2>
    </section>

    <section class="row">
      <h2 class="col-12">
        Moderations:
        <h3 v-if="moderatedChallenges.length === 0">You don't moderate any challenges</h3>
        <div v-else>
          <p>Active: <span class="text-secondary">You are a moderator of these</span></p>
          <div v-for="challenge in moderatedChallenges" :key="challenge.id">
            <div v-if="challenge.status == true">
              <ChallengeCard :challenge="challenge.challenge" /><i @click="removeModeration(challenge.id)"
                class="mdi mdi-delete text-danger selectable"></i>
            </div>
          </div>
          <p>Pending: <span class="text-secondary">You are waiting for permission</span></p>
          <p class="text-secondary">Out going</p>
          <div v-for="challenge in moderatedChallenges" :key="challenge.id">
            <div v-if="challenge.status == false && challenge.originId == account.id">
              {{ challenge.challenge.name }} | {{ challenge.challenge.creator.name }} <i
                @click="removeModeration(challenge.id)" class="mdi mdi-delete text-danger selectable"></i>
            </div>
          </div>
          <p class="text-secondary">In coming</p>
          <div v-for="challenge in moderatedChallenges" :key="challenge.id">
            <div v-if="challenge.status == false && challenge.originId != account.id">
              {{ challenge.challenge.name }} | {{ challenge.challenge.creator.name }} <i
                @click="ApproveModeration(challenge.id)" class="mdi mdi-check-circle text-success selectable"></i> <i
                @click="removeModeration(challenge.id)" class="mdi mdi-delete text-danger selectable"></i>
            </div>
          </div>
          <h3>Needs Permission: <span class="text-secondary">These need your approval</span></h3>
          <div v-for="exMod in externalModerators" :key="exMod.id">
            <div v-if="exMod.status == false">
              {{ exMod.challenge.name }} | {{ exMod.profile.name }} <i @click="ApproveModeration(exMod.id)"
                class="mdi mdi-check-circle text-success selectable"></i>
              <i @click="removeModeration(exMod.id)" class="mdi mdi-delete text-danger selectable"></i>
            </div>
          </div>
        </div>
      </h2>
    </section>

    <section class="row">
      <h2 class="col-12">
        Challenges Joined:
        <h3 v-if="joinedChallenges.length === 0">You haven't joined any challenges</h3>
        <div v-else v-for="challenge in joinedChallenges" :key="challenge.id">
          <ChallengeCard :challenge="challenge" />
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
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Account</h1>
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

    async function getMyModerationsByUserId() {
      try {
        await moderatorsService.getMyModerationsByUserId(AppState.account.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }

    async function getModerationsByChallengeCreatorId() {
      try {
        await moderatorsService.getModerationsByChallengeCreatorId(AppState.account.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }



    async function getMyJoinedChallenges() {
      // try {
      //   await challengesService.getMyJoinedChallenges(AppState.account.id)
      // } catch (error) {
      //   Pop.toast(error, 'error')
      // }
    }

    watchEffect(() => {
      if (AppState.account.id) {
        getMyChallenges()
        getMyBadges()
        getMyModerationsByUserId()
        getModerationsByChallengeCreatorId()
        getMyJoinedChallenges()
      }
    })
    return {
      account: computed(() => AppState.account),
      myChallenges: computed(() => AppState.myChallenges),
      joinedChallenges: computed(() => []),
      completedChallenges: computed(() => []),
      moderatedChallenges: computed(() => AppState.myModerations),
      externalModerators: computed(() => AppState.moderators),

      async removeModeration(moderationId) {
        try {
          const confirmRemove = await Pop.confirm('Delete Moderation?')
          if (!confirmRemove) {
            return
          }
          await moderatorsService.removeModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
      async ApproveModeration(moderationId) {
        try {
          const confirmApprove = await Pop.confirm('Approve Moderation?')
          if (!confirmApprove) {
            return
          }
          await moderatorsService.ApproveModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },

    };
  },
  components: { AccountForm, ChallengeCard }
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
