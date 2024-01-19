<template>
  <div class="container-fluid" v-if="profile">
    <section class="row dark-blue-bg">
      <div class="p-0">
        <img class="coverImg-style" :src="profile.coverImg" alt="Cover Image">
      </div>

      <div class="col-12 text-white">
        <section class="row justify-content-between">
          <div class="col-md-7 col-12 d-flex summary-height">
            <SummarySection :profile="profile" :account="profile" :challenges="challenges" :participation="participation" :milestones="milestones" />
          </div>

          <div class="col-4 align-items-center justify-content-end d-none d-md-flex summary-height">
            <router-link :to="{ name: 'Profile.challenges' }">
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
        <router-view />
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
import { computed, onUnmounted, ref, watch } from 'vue';
import { profilesService } from '../services/ProfilesService';
import SummarySection from '../components/AccountAndProfilePage/SummarySection.vue';
import ProfileLinksCard from '../components/AccountAndProfilePage/ProfileLinksCard.vue';
import { logger } from '../utils/Logger.js';
import { router } from '../router.js';

export default {
  setup() {

    const MilestonesError = ref('')
    const route = useRoute();

    const profileId = computed(() => route.params.profileId)

    async function getProfile() {
      try {
        return await profilesService.getProfile(profileId.value);
      }
      catch (error) {
        Pop.error(error.message);
      }
    }

    // Challenges created by this profile or ones they are moderating
    async function getChallenges() {
      try {
        return await profilesService.getChallenges(profileId.value);
      }
      catch (error) {
        Pop.error(error.message);
      }
    }

    // this also includes the badges associated with this profile
    // participation => p.status == 'completed'||'active'
    async function getParticipation() {
      try {
        return await profilesService.getParticipation(profileId.value)
      } catch (error) {
        Pop.error(error.message)
      }
    }

    async function calculateProfileRank() {
      try {
        return await profilesService.calculateProfileRank(profileId.value)
      } catch (error) {
        Pop.error(error.message)
      }
    }

    async function getMilestones() {
      try {
        return await profilesService.getMilestones(profileId.value)
      } catch (error) {
        logger.error('[MILESTONES_ERROR_PROFILE_DATA]', error)
        MilestonesError.value = 'Sorry we were unable to pull the milestones for this account. We are working on it try again later'
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

    async function getProfileData() {
      try {
        AppState.ProfileState.loading = true
        await Promise.allSettled([
          getProfile(),
          getParticipation(),
          getChallenges(),
          calculateProfileRank(),
          getMilestones(),
        ])


        if (!AppState.ProfileState.profile) {
          throw new Error('Unable to fetch profile')
        }

        AppState.ProfileState.loading = false
      } catch (error) {
        logger.error({ error })
        Pop.error(error)
        router.push({ name: 'Error' })
      }
    }

    watch(profileId, () => {
      getProfileData()
    }, { immediate: true });

    onUnmounted(() => {
      clearProfile();
    });

    return {
      loading: computed(() => AppState.ProfileState.loading),
      profile: computed(() => AppState.ProfileState.profile),
      challenges: computed(() => AppState.ProfileState.challenges),
      participation: computed(() => AppState.ProfileState.participation),
      milestones: computed(() => AppState.ProfileState.milestones),
      MilestonesError
    };
  },
  components: { SummarySection, ProfileLinksCard }
}
</script>


<style lang="scss" scoped>
.summary-height {
  height: 9vh;
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