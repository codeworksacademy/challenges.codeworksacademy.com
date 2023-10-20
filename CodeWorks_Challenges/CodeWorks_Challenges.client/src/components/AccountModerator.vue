<template>
  <h2 class="col-12">
    Moderations:
    <h3 v-if="myModerations.length === 0 && moderators.length == 0">You don't moderate any challenges</h3>
    <div v-else>
      <p>My Active Moderations:</p>
      <div v-for="challenge in myModerations" :key="challenge.id">
        <div v-if="challenge.status == 'Active'">
          <ChallengeCard :challenge="challenge.challenge" /><i @click="removeModeration(challenge.id)"
            class="mdi mdi-delete text-danger selectable"></i>
        </div>
      </div>
      <p>Pending:</p>
      <p class="text-secondary">you're waiting to be approved</p>
      <div v-for="challenge in myModerations" :key="challenge.id">
        <div v-if="challenge.status == 'Inactive' && challenge.originId == account.id">
          <div class="bg-primary mb-3 rounded">
            <h6>
              ID-{{ challenge.id }}
            </h6>
            <h6>
              AccountID-{{ challenge.accountId }}
            </h6>
            <h6>
              ChallengeID-{{ challenge.challengeId }}
            </h6>
            <h6>
              OriginID- {{ challenge.originId }}
            </h6>

            <h4>Profile: {{ challenge.profile.name }} | {{ challenge.profile.id }}</h4>
            <h4>Challenge: {{ challenge.challenge.name }} | {{ challenge.challenge.id }} </h4>
            <h4>Creator: {{ challenge.challenge.creator.name }} | {{ challenge.challenge.creator.id }}</h4>
            <h4>Status: {{ challenge.status }}</h4>
            <i @click="removeModeration(challenge.id)" class="mdi mdi-delete text-danger selectable"></i>
          </div>
        </div>
      </div>
      <p class="text-secondary">your moderation has been requested</p>
      <div v-for="challenge in myModerations" :key="challenge.id">
        <div v-if="challenge.status == 'Inactive' && challenge.originId != account.id">
          <div class="bg-primary mb-3 rounded">
            <h6>
              ID-{{ challenge.id }}
            </h6>
            <h6>
              AccountID-{{ challenge.accountId }}
            </h6>
            <h6>
              ChallengeID-{{ challenge.challengeId }}
            </h6>
            <h6>
              OriginID- {{ challenge.originId }}
            </h6>

            <h4>Profile: {{ challenge.profile.name }} | {{ challenge.profile.id }}</h4>
            <h4>Challenge: {{ challenge.challenge.name }} | {{ challenge.challenge.id }} </h4>
            <h4>Creator: {{ challenge.challenge.creator.name }} | {{ challenge.challenge.creator.id }}</h4>
            <h4>Status: {{ challenge.status }}</h4>
            <i @click="ApproveModeration(challenge.id)" class="mdi mdi-check-circle text-success selectable"></i>
            <i @click="removeModeration(challenge.id)" class="mdi mdi-delete text-danger selectable"></i>
          </div>
        </div>
      </div>
      <p class="text-secondary">Someone wants to moderate your challenge</p>
      <div v-for="challenge in moderators" :key="challenge.id">
        <div v-if="challenge.status == 'Inactive' && challenge.originId != account.id">
          <div class="bg-primary mb-3 rounded">
            <h6>
              ID-{{ challenge.id }}
            </h6>
            <h6>
              AccountID-{{ challenge.accountId }}
            </h6>
            <h6>
              ChallengeID-{{ challenge.challengeId }}
            </h6>
            <h6>
              OriginID- {{ challenge.originId }}
            </h6>

            <h4>Profile: {{ challenge.profile.name }} | {{ challenge.profile.id }}</h4>
            <h4>Challenge: {{ challenge.challenge.name }} | {{ challenge.challenge.id }} </h4>
            <h4>Creator: {{ challenge.challenge.creator.name }} | {{ challenge.challenge.creator.id }}</h4>
            <h4>Status: {{ challenge.status }}</h4>
            <i @click="ApproveModeration(challenge.id)" class="mdi mdi-check-circle text-success selectable"></i>
            <i @click="removeModeration(challenge.id)" class="mdi mdi-delete text-danger selectable"></i>
          </div>
        </div>
      </div>

      <p class="text-secondary">Moderators you've asked to join</p>
      <div v-for="challenge in  moderators " :key="challenge.id">
        <div v-if="challenge.status == 'Inactive' && challenge.originId == account.id">
          <div class="bg-primary mb-3 rounded">
            <h6>
              ID-{{ challenge.id }}
            </h6>
            <h6>
              AccountID-{{ challenge.accountId }}
            </h6>
            <h6>
              ChallengeID-{{ challenge.challengeId }}
            </h6>
            <h6>
              OriginID- {{ challenge.originId }}
            </h6>

            <h4>Profile: {{ challenge.profile.name }} | {{ challenge.profile.id }}</h4>
            <h4>Challenge: {{ challenge.challenge.name }} | {{ challenge.challenge.id }} </h4>
            <h4>Creator: {{ challenge.challenge.creator.name }} | {{ challenge.challenge.creator.id }}</h4>
            <h4>Status: {{ challenge.status }}</h4>
            <i @click="removeModeration(challenge.id)" class="mdi mdi-delete text-danger selectable"></i>
          </div>
        </div>
      </div>
    </div>
  </h2>
</template>


<script>
import { computed, watchEffect } from "vue"
import { AppState } from "../AppState.js"
import { moderatorsService } from "../services/ModeratorsService.js"
import Pop from "../utils/Pop.js"

export default {
  setup() {

    // This returns moderations where the accountId is the same as account.id
    async function getMyModerationsByUserId() {
      try {
        await moderatorsService.getMyModerationsByUserId(AppState.account.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }


    // This is returning moderations that have challenge Ids that belong to you
    async function getModerationsByChallengeCreatorId() {
      try {
        await moderatorsService.getModerationsByChallengeCreatorId(AppState.account.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }
    watchEffect(() => {
      if (AppState.account.id) {
        getMyModerationsByUserId()
        getModerationsByChallengeCreatorId()
      }
    })
    return {
      account: computed(() => AppState.account),
      myChallenges: computed(() => AppState.myChallenges),
      myModerations: computed(() => AppState.myModerations),
      moderators: computed(() => AppState.moderators),

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
    }
  }
}
</script>


<style lang="scss" scoped></style>