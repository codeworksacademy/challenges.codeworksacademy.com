<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid text-light pb-5">
    <div class="col-12" :style="`background-image: url(${challenge.coverImg}); opacity: .9; background-repeat: no-repeat; background-size: cover; background-position:center; height:150px; overflow-x: hidden;`">
    <h1 class="m-5 text-center">{{ challenge.name }}</h1>
    </div>
    <div class="d-flex mobile-column-query justify-content-center pt-5" style="height: 100%; background: #161d2b">
      <!-- STUB - Offcanvas Challenge Detail router-view links -->
      <div class="col-md-4 rounded-3 mobile-menu" style="height:100vh; background: #0c0e13">
        <ChallengeDetailsMenu />
      </div>
      <!-- STUB - Challenge Details for active route -->
      <div class="col-md-8 pt-0 m-0" style="height: 100%;">
        <div>
          <router-view />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Pop from '../utils/Pop'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'
import { challengeModeratorsService } from '../services/ChallengeModeratorsService'
import ChallengeDetailsMenu from '../components/ChallengeDetailsMenu.vue'

export default {
    setup() {
        const loading = ref(false)
        const route = useRoute()
        const router = useRouter()
        const answer = ref("")
        let challengeId = ""

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

        onMounted(() => {
            if (route.params.challengeId != challengeId) {
                challengeId = route.params.challengeId;
                getParticipantsByChallengeId();
                getModeratorsByChallengeId();
                setActiveChallenge();
            }
        })

        return {
          loading,
          challenge: computed(() => AppState.ChallengeState.challenge),
          isParticipant: computed(() => {
            return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id);
          }),
          isModStatus: computed(() => {
            const isMod = AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id);
            if (isMod) {
              if (isMod.status == false) {
                return "pending";
              }
              else return "approved";
            }
            else return "null";
          })
        };
    },

    components: { ChallengeDetailsMenu }
}
</script>

<style scoped lang="scss">
.container-fluid {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

@media screen and (max-width: 768px) {
  .container-fluid {
    height: 100%;
    width: 100%;
    .mobile-column-query {
      display: flex;
      flex-direction: column;
      .mobile-menu {
        display: block;
        max-height: 350px;
        width: 100%;
      }
    }
    .col-4 .col-8 {
      height:100%;
    }
  }
}
</style>