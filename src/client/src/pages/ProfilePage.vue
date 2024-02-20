<template>
  <div class="container-fluid" v-if="profile?.id">
    <section class="row dark-blue-bg">
      <div class="col-12 p-0">
        <img class="coverImg-style" :src="profile.coverImg" alt="Cover Image">
      </div>

      <div class="col-12 text-white mb-3" v-if="summary">
        <SummarySection :profile="profile" :summary="summary" />
      </div>
    </section>

    <section class="row">
      <div class="col-12 col-lg-3">
        <ProfileLinksCard />
      </div>

      <div class="col-12 col-lg-9 pe-lg-4">
        <router-view />
      </div>
    </section>
  </div>

  <div class="container-fluid p-5 text-center" v-else>
    <h1 class="fs-1 fw-bold">
      Loading... <i class="mdi mdi-loading mdi-spin"></i>
    </h1>
  </div>
</template>


<script>
import Pop from "../utils/Pop.js";
import { AppState } from '../AppState';
import { logger } from "../utils/Logger.js";
import { useRoute, useRouter } from "vue-router";
import { computed, onUnmounted, ref, watchEffect, } from 'vue'
import { profilesService } from "../services/ProfilesService.js";
import SummarySection from '../components/ProfilePage/SummarySection.vue';
import ProfileLinksCard from '../components/ProfilePage/ProfileLinksCard.vue';

export default {
  components: { SummarySection, ProfileLinksCard },
  setup() {

    const route = useRoute();
    const router = useRouter();
    const MilestonesError = ref('');

    onUnmounted(() => { profilesService.clearProfile(); });

    watchEffect(() => {
      if (route.params.profileId) {
        getProfileData();
      }
    });

    async function getProfileData() {
      try {
        if (AppState.ProfileState.profile?.id == route.params.profileId) { return }
        await Promise.allSettled([
          getProfileById(),
          getChallenges(),
          getParticipation(),
          // calculateProfileRank(),
          getMilestones()
        ])
        if (!AppState.ProfileState.profile) { throw new Error('Unable to fetch profile') }
        // Checking on data received - will remove on official release
        logger.log('[PROFILE PAGE] getProfileData profile', AppState.ProfileState.profile)
        logger.log('[PROFILE PAGE] getProfileData challenges', AppState.ProfileState.challenges)
        logger.log('[PROFILE PAGE] getProfileData participation', AppState.ProfileState.participation)
        logger.log('[PROFILE PAGE] getProfileData moderation', AppState.ProfileState.moderation)
        logger.log('[PROFILE PAGE] getProfileData milestones', AppState.ProfileState.milestones)
      }
      catch (error) {
        Pop.error('Error when getting profile dataset', error);
        router.push({ name: 'Error' });
      }
    }

    async function getProfileById() {
      try { return await profilesService.getProfileById(route.params.profileId); }
      catch (error) { Pop.error('[PROFILE PAGE] getProfileById', error.message); }
    }

    async function getChallenges() {
      try { return await profilesService.getChallenges(route.params.profileId); }
      catch (error) { Pop.error('[PROFILE PAGE] getChallenges', error.message); }
    }

    // this also includes the badges associated with this profile
    // participation => p.status == 'completed'||'active'
    async function getParticipation() {
      try { return await profilesService.getParticipation(route.params.profileId); }
      catch (error) { Pop.error('[PROFILE PAGE] getParticipation', error.message); }
    }

    async function calculateProfileRank() {
      try { return await profilesService.calculateProfileRank(route.params.profileId) }
      catch (error) { Pop.error('[PROFILE PAGE] calculateProfileRank', error.message); }
    }

    async function getMilestones() {
      try { return await profilesService.getMilestones(route.params.profileId) }
      catch (error) {
        Pop.error('[PROFILE PAGE] getMilestones', error)
        MilestonesError.value = 'Sorry we were unable to pull the milestones for this account. We are working on it try again later'
      }
    }

    return {
      MilestonesError,
      profile: computed(() => AppState.ProfileState.profile),
      challenges: computed(() => AppState.ProfileState.challenges),
      participation: computed(() => AppState.ProfileState.participation),
      milestones: computed(() => AppState.ProfileState.milestones),
      summary: computed(() => {
        return {
          challenges: AppState.ProfileState.challenges?.length,
          milestones: AppState.ProfileState.milestones?.length,
          badges: AppState.ProfileState.participation.filter(p => p.status == 'completed').length
        }
      }),

    };
  }
}
</script>

<style scoped>
.modal-body {
  background-color: #151d2b;
}

.modal-header {
  background-color: #151d2b;
}

.coverImg-style {
  object-fit: cover;
  object-position: center;
  height: 12vh;
  width: 100%;
}

.dark-blue-bg {
  background-color: #0E131B;
}

.aqua-btn-outline {
  border: 1px solid #00CCE6;
  color: #00CCE6;
}

.aqua-btn-outline:hover {
  background-color: #00CCE6;
  color: black;
}
</style>