<template>
  <section v-if="challenge" :key="challenge?.id" class="text-light pb-5" style="overflow-x: hidden;">
    <div class="col-12 bottom-fade"
      :style="`background-image: url(${challenge.coverImg}); background-size: cover; background-position: center; background-repeat: no-repeat;`">
      <h1 class="text-center">{{ challenge.name }}</h1>
    </div>
    <div class="container-fluid pt-3" style=" background: #161d2b">
      <div class="row">
        <div class="col-lg-2 rounded-3 mobile-menu">
          <ChallengeDetailsMenu class="sticky-top" />
        </div>
        <div class="col-lg-10">
          <div class="row">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Pop from '../utils/Pop'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { computed, watch, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'
import { challengeModeratorsService } from '../services/ChallengeModeratorsService'
import ChallengeDetailsMenu from '../components/ChallengeDetailsMenu.vue'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const answer = ref("")
    const challengeId = computed(() => route.params.challengeId)

    async function setActiveChallenge() {
      try {
        const challengeId = route.params.challengeId;
        await challengesService.setActiveChallenge(challengeId);
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }
    async function getParticipantsByChallengeId() {
      try {
        await participantsService.getParticipantsByChallengeId(route.params.challengeId);
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }

    async function getModeratorsByChallengeId() {
      try {
        await challengeModeratorsService.getModeratorsByChallengeId(route.params.challengeId);
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }

    function clearChallenge() {
      try {
        challengesService.clearChallenge();
      }
      catch (error) {
        Pop.error(error.message);
      }
    }

    async function getChallengeData() {
      try {
        AppState.ChallengeState.loading = true
        await Promise.allSettled([
          setActiveChallenge(),
          getParticipantsByChallengeId(),
          getModeratorsByChallengeId(),
        ])

        if (!AppState.ChallengeState.challenge) {
          throw new Error('Unable to fetch challenge')
        }

        AppState.ChallengeState.loading = false
      } catch (error) {
        logger.error({ error })
        Pop.error(error)
        router.push({ name: 'Error' })
      }
    }

    watch(challengeId, () => {
      getChallengeData()
    }, { immediate: true });

    onMounted(() => {
      clearChallenge()
    });

    return {
      loading: computed(() => AppState.ProfileState.loading),
      challenge: computed(() => AppState.ChallengeState.challenge),
      participant: computed(() => AppState.ChallengeState.participant),
      moderator: computed(() => AppState.ChallengeState.moderator),
    };
  },

  components: { ChallengeDetailsMenu }
}
</script>

<style scoped lang="scss">
.bottom-fade {
  position: relative;
  height: 150px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: rgb(255, 255, 255);
  text-shadow: 0 0 5px 0 gray;
  box-shadow: inset 0 -20px 10px 0 #151d2b;
  background: linear-gradient(180deg, rgba(85, 21, 21, 0) 0%, #151d2b 80%, #151d2b 100%);
  opacity: .9;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    text-shadow: 0 5px 0px black !important;
  }

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.271)
  }
}

</style>