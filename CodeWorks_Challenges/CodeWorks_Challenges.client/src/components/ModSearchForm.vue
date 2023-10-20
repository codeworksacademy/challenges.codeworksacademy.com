<template>
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ModeratorSearch">
    Add moderator
  </button>

  <!-- Modal Componentify this-->
  <div class="modal fade" id="ModeratorSearch" tabindex="-1" aria-labelledby="ModeratorSearchLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="ModeratorSearchLabel">Add a moderator</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="searchProfiles()" class="form-group d-flex">
            <button class="btn btn-primary">Search</button>
            <input v-model="editable.name" class="form-control" type="text" placeholder="Profile Name" min-length="3"
              maxlength="150" required>
          </form>
          <div>
            Search Results:
            <div v-for="profile in Profiles" :key="profile.name">
              {{ profile.name }} <button v-if="!moderators.find(m => m.accountId == profile.id)"
                @click="createModeration(profile.id)" class="mb-3">Send Invite</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed, ref } from "vue";
import { AppState } from '../AppState'
import { profilesService } from "../services/ProfilesService.js";
import { logger } from "../utils/Logger.js";
import Pop from "../utils/Pop.js";
import { useRoute } from "vue-router";
import { moderatorsService } from "../services/ModeratorsService.js";

export default {
  setup() {
    const editable = ref({
      name: ''
    })
    const route = useRoute()
    return {
      editable,
      moderators: computed(() => AppState.moderators),
      Profiles: computed(() => {
        return AppState.profiles.filter((profile) => profile.id != AppState.account.id)
      }),
      async searchProfiles() {
        try {
          const name = editable.value.name
          await profilesService.searchProfiles(name)
        } catch (error) {
          logger.error(error)
          Pop.toast(error, 'error')
        }
      },
      async createModeration(profileId) {
        try {
          const moderatorData = {
            challengeId: route.params.challengeId,
            accountId: profileId
          }
          await moderatorsService.createModeration(moderatorData)
          Pop.success('You have requested that this profile become a moderator, Please be patient while they review your request')
        } catch (error) {
          logger.error(error)
          Pop.toast(error, 'error')
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped></style>