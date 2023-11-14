<template>
  <div class="table-responsive">
    <table class="table table-dark table-sm">
      <thead>
        <tr>
          <th scope="col">Profile</th>
          <th scope="col">Challenge</th>
          <th scope="col">Creator</th>
          <th scope="col">Status</th>
          <th scope="col">Remove</th>
          <th scope="col">
            <span v-if="moderationProp.originId != account.id">
              Approve
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="table-col-style">
            <span class="d-block w-75 text-truncate">
              {{ moderationProp.profile.name }}
            </span>
          </td>
          <td class="table-col-style">
            <span class="d-block w-75 text-truncate">
              {{ moderationProp.challenge.name }}
            </span>
          </td>
          <td class="table-col-style text-truncate">
            <span class="d-block w-75 text-truncate">
              {{ moderationProp.challenge.creator.name }}
            </span>
          </td>
          <td class="table-col-style text-truncate">
            <span class="d-block w-75 text-truncate">
              {{ moderationProp.status }}
            </span>
          </td>
          <td>
            <button class="btn" @click="removeModeration(moderationProp.id)" title="remove moderation">
              <i class="mdi mdi-delete text-danger selectable"></i>
            </button>
          </td>
          <td>
            <button v-if="moderationProp.originId != account.id" class="btn" @click="approveModeration(moderationProp.id)"
              title="approve moderation">
              <i class="mdi mdi-check-circle text-success selectable"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
.table-col-style {
  width: 20%;
}
</style>