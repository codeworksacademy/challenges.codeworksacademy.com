<template>
  <div class="bg-dark text-light p-2 mb-3 m-2 rounded">
    <div class="d-flex justify-content-evenly">
      <p>
        Profile: {{ moderationProp.profile.name }}
      </p>
      <p>
        Challenge: {{ moderationProp.challenge.name }}
      </p>
      <p>
        Creator: {{ moderationProp.challenge.creator.name }}
      </p>
      <p>
        Status: {{ moderationProp.status }}
      </p>
    </div>
    <div>
      <button v-if="moderationProp.originId != account.id" class="btn" @click="approveModeration(moderationProp.id)" title="approve moderation">
        <i class="mdi mdi-check-circle text-success selectable"></i>
      </button>
      <button class="btn" @click="removeModeration(moderationProp.id)" title="remove moderation">
        <i class="mdi mdi-delete text-danger selectable"></i>
      </button>
    </div>
  </div>
</template>


<script>
import { computed } from 'vue'
import { Moderator } from '../models/Moderator'
import { AppState } from '../AppState'

export default {
  props: {
    moderationProp: {Type: Moderator, required: true}
  },

  setup(){
    return {
      account: computed(() => AppState.account),

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

      async approveModeration(moderationId) {
        try {
          const confirmApprove = await Pop.confirm('Approve Moderation?')
          if (!confirmApprove) {
            return
          }
          await moderatorsService.approveModeration(moderationId)
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