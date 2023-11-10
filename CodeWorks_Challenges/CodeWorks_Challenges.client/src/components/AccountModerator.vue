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
          <div v-if="moderation.status == 'Active'">
            <ChallengeCard :challenge="moderation.challenge" /><i @click="removeModeration(challenge.id)"
              class="mdi mdi-delete text-danger selectable"></i>
          </div>
        </div>
      </section>

      <div class="col-12">
        <p class="fs-5">
          Pending:
        </p>
      </div>

      <div class="col-12">
        <p class="text-secondary">you're waiting to be approved</p>
        <div v-for="moderation in myModerations" :key="moderation.id">
          <ModerationCard :moderationProp="moderation" />
        </div>
      </div>

      <div class="col-12">
        <p class="text-secondary">your moderation has been requested</p>
        <div v-for="moderation in myModerations" :key="moderation.id">
          <ModerationCard :moderationProp="moderation" />
        </div>
      </div>

      <div class="col-12">
        <p class="text-secondary">Someone wants to moderate your challenge</p>
        <div v-for="moderation in moderators" :key="moderation.id">
          <ModerationCard :moderationProp="moderation" />
        </div>
      </div>

      <div class="col-12">
        <p class="text-secondary">Moderators you've asked to join</p>
        <div v-for="moderation in moderators" :key="moderation.id">
          <ModerationCard :moderationProp="moderation" />
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { computed, watchEffect } from "vue"
import { AppState } from "../AppState.js"
import { moderatorsService } from "../services/ModeratorsService.js"
import Pop from "../utils/Pop.js"
import ModerationCard from "./ModerationCard.vue"

export default {
    setup() {
        // This returns moderations where the accountId is the same as account.id
        async function getMyModerationsByUserId() {
            try {
                await moderatorsService.getMyModerationsByUserId(AppState.account.id);
            }
            catch (error) {
                Pop.toast(error, 'error');
            }
        }
        // This is returning moderations that have challenge Ids that belong to you
        async function getModerationsByChallengeCreatorId() {
            try {
                await moderatorsService.getModerationsByChallengeCreatorId(AppState.account.id);
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
            myModerations: computed(() => AppState.myModerations),
            moderators: computed(() => AppState.moderators),

        };
    },
    components: { ModerationCard }
}
</script>


<style lang="scss" scoped></style>