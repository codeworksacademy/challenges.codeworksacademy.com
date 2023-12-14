<template>
  <section class="row">
    <div class="col-12">
      <h4>
        Moderations:
      </h4>
    </div>

    <div class="col-12" v-if="myModerations.length === 0 && moderators.length == 0">
      <p>
        You don't moderate any challenges
      </p>
    </div>

    <div class="col-12" v-else>
      <section class="row">
        <div class="col-12">
          <p class="fs-5">
            My Active Moderations:
          </p>
        </div>
        <div class="col-12" v-for="moderation in myModerations" :key="moderation.id">
          <div v-if="moderation.status == 'active'">
            <ChallengeCard :challenge="moderation.challenge" /><i @click="removeModeration(challenge.id)"
              class="mdi mdi-delete text-danger selectable"></i>
          </div>
        </div>
      </section>

      <div class="col-12">
        <p class="fs-5">
          Pending:
        </p>
        <div v-for="moderation in myModerations" :key="moderation.id">
          <ModerationCard :moderationProp="moderation"
            v-if="moderation.originId != account.id && moderation.status == 'pending'" />
        </div>
      </div>

      <div class="col-12">
        <div class="fs-4">Challenge Moderators</div>
        <p class="text-secondary">Active</p>
        <div v-for="moderation in moderators" :key="moderation.id">
          <ModerationCard :moderationProp="moderation"
            v-if="moderation.originId == account.id && moderation.status == 'active'" />
        </div>
        <p class="text-secondary">Pending</p>
        <div v-for="moderation in moderators" :key="moderation.id">
          <ModerationCard :moderationProp="moderation"
            v-if="moderation.originId == account.id && moderation.status == 'pending'" />
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { computed, watchEffect } from "vue"
import { AppState } from "../AppState.js"
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"
import Pop from "../utils/Pop.js"
import ModerationCard from "./ModerationCard.vue"
import ChallengeCard from "./ChallengeCard.vue"

export default {
  setup() {
    // This returns moderations where the accountId is the same as account.id
    async function getMyModerationsByUserId() {
      try {
        await challengeModeratorsService.getMyModerationsByUserId(AppState.account.id);
      }
      catch (error) {
        Pop.toast(error, 'error');
      }
    }
    // This is returning moderations that have challenge Ids that belong to you
    async function getModerationsByChallengeCreatorId() {
      try {
        await challengeModeratorsService.getModerationsByChallengeCreatorId(AppState.account.id);
      }
      catch (error) {
        Pop.toast(error, 'error');
      }
    }
    watchEffect(() => {
      if (AppState.account.id) {
        getMyModerationsByUserId();
        getModerationsByChallengeCreatorId();
      }
    });
    return {
      account: computed(() => AppState.account),
      myChallenges: computed(() => AppState.myChallenges),
      myModerations: computed(() => {
        let moderators = AppState.myModerations
        let filterModerators = moderators.filter((m) => m.challenge.creatorId != AppState.account.id)
        return filterModerators
      }),
      moderators: computed(() => {
        let moderators = AppState.moderators
        let filterModerators = moderators.filter((m) => m.accountId != AppState.account.id)
        return filterModerators
      }),

    };
  },
  components: { ModerationCard, ChallengeCard }
}
</script>


<style lang="scss" scoped></style>