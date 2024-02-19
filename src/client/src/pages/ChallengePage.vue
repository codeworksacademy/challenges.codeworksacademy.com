<template>
  <div class="container-fluid">
    <section v-if="challenge" class="row text-light pb-5" style="overflow-x: hidden;">

      <div class="col-12 bottom-fade challenge-BG-img" :style="`background-image: url(${challenge.coverImg});`">
        <h1 class="text-center">{{ challenge.name }}</h1>
      </div>

      <div class="col-12 col-lg-2 pt-3" style="background: #161d2b">
        <ChallengeDetailsMenu class="sticky-top" />
      </div>

      <div class="col-12 col-lg-10 pt-3">
        <div class="row">
          <router-view />
        </div>
      </div>

    </section>

    <section v-else class="row">
      <div class="col-12 p-5 text-center">
        <h1 class="fs-1 fw-bold">
          Loading... <i class="mdi mdi-loading mdi-spin"></i>
        </h1>
      </div>
    </section>

  </div>
</template>

<script>
import Pop from '../utils/Pop'
import { AppState } from '../AppState'
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'
import { challengeModeratorsService } from '../services/ChallengeModeratorsService'
import ChallengeDetailsMenu from '../components/ChallengeDetailsMenu.vue'

export default {
  setup() {

    const route = useRoute();
    const router = useRouter();

    onMounted(() => { clearChallenge() });
    function clearChallenge() {
      try { challengesService.clearChallenge(); }
      catch (error) { Pop.error('[CHALLENGE PAGE] clearChallenge', error); }
    }

    watch(() => route.params.challengeId, () => { getChallengeData(); }, { immediate: true });

    async function getChallengeData() {
      try {
        await Promise.allSettled([
          setActiveChallenge(),
          getParticipantsByChallengeId(),
          getModeratorsByChallengeId()
        ])

        if (!AppState.ChallengeState.challenge) {
          throw new Error('Unable to fetch challenge');
        }
      } catch (error) {
        Pop.error('[CHALLENGE PAGE] getChallengeData', error);
        // router.push({ name: 'Error' });
      }
    }

    async function setActiveChallenge() {
      try { await challengesService.setActiveChallenge(route.params.challengeId); }
      catch (error) { Pop.toast('[CHALLENGES PAGE] setActiveChallenge', error); }
    }
    async function getParticipantsByChallengeId() {
      try { await participantsService.getParticipantsByChallengeId(route.params.challengeId); }
      catch (error) { Pop.toast('[CHALLENGES PAGE] getParticipantsByChallengeId', error); }
    }

    async function getModeratorsByChallengeId() {
      try { await challengeModeratorsService.getModeratorsByChallengeId(route.params.challengeId); }
      catch (error) { Pop.toast('[CHALLENGES PAGE] getModeratorsByChallengeId', error); }
    }

    return {
      challenge: computed(() => AppState.ChallengeState.challenge),
      participant: computed(() => AppState.ChallengeState.participant),
      moderator: computed(() => AppState.ChallengeState.moderator),
    };
  },

  components: { ChallengeDetailsMenu }
}
</script>

<style scoped lang="scss">
.challenge-BG-img {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.bottom-fade {
  position: relative;
  height: 150px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(255, 255, 255);
  text-shadow: 0 0 5px 0 gray;
  box-shadow: inset 0 -20px 10px 0 #151d2b;
  background: linear-gradient(180deg, rgba(85, 21, 21, 0) 0%, #151d2b 80%, #151d2b 100%);
  // background-repeat: no-repeat;
  // background-position: center;
  // background-size: cover;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    text-shadow: 0 5px 0px black !important;
    filter: brightness(1);
  }

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.371)
  }
}
</style>