<template>
  <section class="container-fluid" v-if="challengeCreator">

    <div v-if="challenge" :key="challenge.id" class="row d-flex justify-content-center align-items-center">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h1 class="text-center"> {{ challenge.name }} </h1>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.description }} </h3>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.status }} </h3>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.creator.name }} </h3>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <p v-html="difficulty.html"></p>
      </div>
      <section>
        <div class="col-12 d-flex justify-content-center align-items-center">
          <h3 class="text-uppercase">Challenge Requirements</h3>
        </div>
        <ol>
          <li v-for="(requirement, index) in challenge.requirements" :key="index">
            <div class="form-check ps-5">
              <input type="checkbox" class="form-check-input" v-model="requirement.completed" :id="`field-${requirement.step}`">
              <label class="form-check-label" :for="`field-${requirement.step}`">{{ requirement.step }}</label>
            </div>
            <div class="col-12 d-flex align-items-center form-group mt-1 m-auto no-wrap mt-3">
              <label class=" pe-3" for="comment">Comment:</label>
              <input type="text" name="comment" id="comment" class="form-control mt-1" placeholder="Leave insight for this step..." rows="1" v-model="requirement.comment" />
            </div>
            <hr class="mb-4" style="color: white; opacity: .4;" />
          </li>
        </ol>
      </section>
      <!-- <div v-if="challenge.requirements.length > 0" class="col-md-8 bg-dark text-light p-3 mb-3">
        <div v-for="(requirement, index) in challenge.requirements" :key="index">
          <i class="text-light">
            {{ index + 1 }}:
          </i>
          <p>
            Step: {{ requirement.step }}
            Comment: {{ requirement.comment }}
          </p>
        </div>
      </div> -->
    </div>

  <div v-if="challengeCreator" class="col-9 d-flex justify-content-center align-items-center position-fixed bottom-2">
    <!-- STUB - OFFCANVAS BUTTON - Array of Submitted Challenge Participants -->
    <a
      role="button"
      class="d-flex justify-content-center align-items-center mdi mdi-chevron-up text-warning bg-primary rounded-circle fs-1"
      style="aspect-ratio: 1/1; height: 50px; width: 50px;"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#submissionsOffcanvas"
      aria-controls="offcanvasBottom">
    </a>
  </div>

  <div v-for="status in participantFilter.status" :key="status.id" class="col-12 d-flex justify-content-center align-items-center">
    <ParticipantCard :participant="status" />
  </div>
  <div v-for="p in participants" :key="p.name" class="col-12 d-flex justify-content-center align-items-center pb-5 mb-5">
    <GradeSubmissionForm :participant="p" />
  </div>
  </section>
</template>
  
<script>
import GradeSubmissionForm from "../components/GradeSubmissionForm.vue"
import ParticipantCard from "../components/ParticipantCard.vue"
import { computed, onMounted, ref, watchEffect } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
// import SubmissionCard from '../components/SubmissionCard.vue'
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { participantsService } from '../services/ParticipantsService'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

export default {
  components: {
    // SubmissionCard,
    GradeSubmissionForm,
    ParticipantCard
  },
  setup() {
    let route = useRoute()

    const filterBy = ref('')
    const editable = computed(() => 
      newChallengeParticipant({ state: AppState }, filterBy.value)
    )

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(route.params.challengeId)
        logger.log(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function getParticipantsByChallengeId() {
      try {
        const challengeId = route.params.challengeId
        await participantsService.getParticipantsByChallengeId(challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    // async function submitGrade() {
    //   try {
        
    //   } catch (error) {
    //     logger.error(error)
    //     Pop.toast(error, 'error')
    //   }
    // }

    function isModeratorStatus() {
      const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }

    

    const challenge = computed(() => {
      return AppState.challenges.find(c => c.id === AppState.activeChallenge.id)
    })
    const participant = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.account.id)
    })

    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
    })

    watchEffect(() => {
      editable.value.status = participant.value?.status
    })

    return {
      filterBy,
      editable,
      // challenge,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      // challengeRequirements,
      myModerations: computed(() => AppState.moderators.filter(m => m.accountId === AppState.account.id)),
      participant,
      participants: computed(() => AppState.participants),
      participantFilter: computed(() => {
        if (!filterBy.value) {
          return AppState.participants
        } else {
          return AppState.participants.filter(p => p.status === filterBy.value)
        }
      }),
      // challenge: computed(() => AppState.activeChallenge),
      challengeCreator: computed(() => AppState.user.id === AppState.activeChallenge?.creatorId),
      isModeratorStatus,
      isParticipant: computed(() => {
        return AppState.participants.find(p => p.accountId === AppState.account.id)
      }),
      difficulty: computed(() =>
        StrDifficultyNum(AppState.activeChallenge.difficulty)
      ),
    } 
  }
}
</script>

<style scoped lang="scss">
ol {
  list-style: none;
  counter-reset: my-counter;
}
ol li {
  position: relative;
  margin-bottom: 10px;
  left: 0px;
}
ol li::before {
  content: counter(my-counter) ':';
  counter-increment: my-counter;
  position: absolute;
}
</style>