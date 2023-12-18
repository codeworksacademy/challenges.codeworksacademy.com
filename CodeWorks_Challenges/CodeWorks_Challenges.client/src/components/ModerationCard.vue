<template>
  <section class="row">
    <div class="col-3">
      {{ moderationProp.profile.name }}
    </div>
    <div class="col-3">
      {{ moderationProp.challenge.name }}
    </div>
    <div class="col-3">
      {{ moderationProp.status }}
    </div>
    <div class="col-3">
      <button class="btn" @click="removeModeration(moderationProp.id)" title="remove moderation">
        <i class="mdi mdi-delete text-danger selectable"></i>
      </button>
      <button v-if="moderationProp.originId != account.id" class="btn" @click="approveModeration(moderationProp.id)"
        title="approve moderation">
        <i class="mdi mdi-check-circle text-success selectable"></i>
      </button>
    </div>
  </section>
</template>


<script>
import { computed } from 'vue'
import { ChallengeModerator } from '../models/ChallengeModerator'
import { AppState } from '../AppState'
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"
import Pop from "../utils/Pop.js"

export default {
  props: {
    moderationProp: { Type: ChallengeModerator, required: true }
  },

  setup() {
    return {
      account: computed(() => AppState.account),

      async removeModeration(moderationId) {
        try {
          const confirmRemove = await Pop.confirm('Delete Moderation?')
          if (!confirmRemove) {
            return
          }
          await challengeModeratorsService.removeModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },

      async approveModeration(moderationId) {
        try {
          const confirmApprove = await Pop.confirm('Approve Moderation?')
          if (!confirmApprove) {
            return
          }
          await challengeModeratorsService.approveModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
    }
  }
}
</script>


<style lang="scss" scoped>
</style>