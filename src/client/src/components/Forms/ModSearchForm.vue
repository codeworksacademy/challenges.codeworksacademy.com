<template>
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ModeratorSearch">
    Add moderator
  </button>

  <div class="modal fade" id="ModeratorSearch" tabindex="-1" aria-labelledby="ModeratorSearchLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content rounded shift-down">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="ModeratorSearchLabel">Add a moderator</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body px-3">
          <form @submit.prevent="getProfiles(), editable.hasSearched = true" class="form-group d-flex">
            <button class="btn btn-primary">Search</button>
            <input v-model="editable.name" class="form-control" type="text" placeholder="Profile Name" min-length="3"
              maxlength="150" required>
          </form>
          <div class="py-2 pt-3">
            <div v-if="editable.hasSearched" class="mb-2"><u>Search Results</u>:</div>
            <div v-else>Search for users</div>
            <div v-if="!Profiles.length > 0 && editable.hasSearched">No results Match Search Criteria</div>
            <div v-for=" profile  in  Profiles " :key="profile.id" class="text-white my-1 d-flex justify-content-center">
              {{ profile.nickname || profile.name }} -
              <span v-if="!isModeratorCheck(profile) && !profile?.added">
                <button @click="addModerator(profile)" class="btn btn-outline-primary ms-1 px-1 py-0">
                  Send Invite
                </button>
              </span>
              <span v-if="isModeratorCheck(profile) || profile?.added">
                <p class="text-muted mb-0 ms-1 px-1 py-0"> Modded </p>
              </span>
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
import Pop from '../../utils/Pop.js';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from '../../AppState.js'
import { profilesService } from '../../services/ProfilesService.js';
import { challengeModeratorsService } from '../../services/ChallengeModeratorsService.js';

export default {
  setup() {
    const editable = ref({});
    const route = useRoute();

    return {
      editable,
      moderators: computed(() => AppState.ChallengeState.moderators),
      isModeratorCheck(profile) {
        return AppState.ChallengeState.moderators.find(m => m.accountId == profile.id);
      },
      Profiles: computed(() => {
        return AppState.profiles.filter((profile) => profile.id != AppState.AccountState.account.id);
      }),

      async getProfiles() {
        try {
          const name = editable.value.name;
          await profilesService.getProfiles(name);
          editable.value.name = '';
        }
        catch (error) { Pop.error('[MOD SEARCH FORM] getProfiles:: ' + error); }
      },

      async addModerator(profile) {
        try {
          const moderatorData = {
            challengeId: route.params.challengeId,
            accountId: profile.id
          };
          await challengeModeratorsService.addModerator(moderatorData);
          profile.added = true;
          Pop.success('You have added ' + profile.nickname);
        }
        catch (error) { Pop.error('[MOD SEARCH FORM] addModerator:: ' + error); }
      }

    }
  }
}
</script>

<style scoped lang="scss">
.shift-down {
  top: 3rem;
}
</style>