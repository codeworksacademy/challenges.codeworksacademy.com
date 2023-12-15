<template>
  <div class="container-fluid" v-if="activeProfile">
    <section class="row dark-blue-bg">
      <div class="p-0">
        <img class="coverImg-style" :src="activeProfile.coverImg" alt="Cover Image">
      </div>

      <div class="col-12 text-white">
        <section class="row justify-content-between">
          <div class="col-md-7 col-12 d-flex summary-height">
            <SummarySection :name="activeProfile.name" :picture="activeProfile.picture" :rankNumber="activeProfile.rank" :challengesCount="(challenges.length + approvedModerations.length)" :reputation="activeProfile.reputation" />
          </div>

          <div class="col-4 align-items-center justify-content-end d-none d-md-flex summary-height">
            <router-link :to="{name: 'Profile Challenges'}">
              <button class="btn aqua-btn-outline my-2">
                View challenges
              </button>
            </router-link>
          </div>
        </section>
      </div>
    </section>

    <section class="row">
      <div class="col-md-3 col-12">
        <ProfileLinksCard />
      </div>

      <div class="col-12 col-md-9 p-0">
        <router-view></router-view>
      </div>
    </section>
  </div>

  <div class="container-fluid" v-else>
    <h1 class="fs-1 fw-bold">
      Loading... <i class="mdi mdi-loading mdi-spin"></i>
    </h1>
  </div>
</template>


<script>
import { useRoute } from 'vue-router';
import Pop from '../utils/Pop';
import { AppState } from '../AppState'
import { computed, onUnmounted, watchEffect } from 'vue';
import { profilesService } from '../services/ProfilesService';
import { challengesService } from '../services/ChallengesService';
import SummarySection from '../components/AccountAndProfilePage/SummarySection.vue';
import { challengeModeratorsService } from '../services/ChallengeModeratorsService';
import { participantsService } from '../services/ParticipantsService';
import ProfileLinksCard from '../components/AccountAndProfilePage/ProfileLinksCard.vue';

export default {
    setup() {
        const route = useRoute();

        async function getProfile() {
          try {
            const profileId = route.params.profileId;
            await profilesService.getProfile(profileId);
          }
          catch (error) {
            Pop.error(error.message);
          }
        }

        async function getProfileChallenges() {
          try {
            const profileId = route.params.profileId;
            await challengesService.getProfileChallenges(profileId);
          }
          catch (error) {
            Pop.error(error.message);
          }
        }

        async function getProfileModerations(){
          try {
            const profileId = route.params.profileId
            await challengeModeratorsService.getModerationsByProfileId(profileId)
          } catch (error) {
            Pop.error(error.message)
          }
        }

        // FIXME - Is this getting a list of participations by this person or just finding the one participant? Need to write new function in back end if latter is true
        async function getProfileParticipations(){
          try {
            const profileId = route.params.profileId
            await participantsService.getParticipantById(profileId)
          } catch (error) {
            Pop.error(error.message)
          }
        }

        function clearProfile() {
          try {
            profilesService.clearProfile();
          }
          catch (error) {
            Pop.error(error.message);
          }
        }

        watchEffect(() => {
          route.params.profileId;
          getProfile();
          getProfileChallenges();
          getProfileModerations();
          getProfileParticipations();
        });

        onUnmounted(() => {
          clearProfile();
        });

        return {
          activeProfile: computed(() => AppState.activeProfile),
          challenges: computed(() => AppState.challenges),

          approvedModerations: computed(() => {
            const approvedMods = AppState.moderations.filter(m => m.status == 'active' && m.challenge.creatorId != AppState.activeProfile.id)

            return approvedMods
          })
        };
    },
    components: { SummarySection, ProfileLinksCard }
}
</script>


<style lang="scss" scoped>
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