<!-- "_id": "6557efba66199f59e5068cb7",
    "creatorId": "6514ee35fc2dcbfab4c9c83b",
    "category": "puzzles",
    "status": "draft",
    "name": "Potato Salad",
    "description": "A potato salad consists of x potatoes, for each potato there needs to be twice as many carrots. How many carrots does a salad with 2 potatoes need?",
    "difficulty": 1,
    "coverImg": "https://i.ibb.co/c21hFZN/card-gradient.png",
    "badgeImg": "",
    "requirements": [
      "step": "",
      completed: false,
      comment: ""
    ],
    "supportLinks": [],
    "createdAt": "2023-11-17T22:56:58.697Z",
    "updatedAt": "2023-11-17T23:02:18.393Z",
    "__v": 0,
    "creator": {
        "title": "n00b",
        "_id": "6514ee35fc2dcbfab4c9c83b",
        "name": "Zoot",
        "picture": "https://imgs.search.brave.com/4DE9jlqGa9EiokE2zWTSoP-XmG8pm-zs5RlkNpreB2A/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9paDAu/cmVkYnViYmxlLm5l/dC9pbWFnZS45ODk5/MjAyODIuMzAxOS9y/YWYsMzYweDM2MCww/NzUsdCxmYWZhZmE6/Y2E0NDNmNDc4Ni5q/cGc",
        "reputation": 0,
        "id": "6514ee35fc2dcbfab4c9c83b"
    },
    "id": "6557efba66199f59e5068cb7" -->



<template>
  <section class="container-fluid">

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
      <div v-if="challenge.requirements.length > 0" class="col-md-8 bg-dark text-light p-3 mb-3">
        <div v-for="(requirement, index) in challenge.requirements" :key="index">
          <i class="text-light">
            {{ index + 1 }}:
          </i>
          <p>
            Step: {{ requirement.step }}
            Comment: {{ requirement.comment }}
          </p>
        </div>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.createdAt }} </h3>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center"> {{ challenge.updatedAt }} </h3>
      </div>

    </div>





  <div v-if="isParticipant" class="col-9 d-flex justify-content-center align-items-center position-fixed bottom-2 hover-magenta">
    <!-- STUB - OFFCANVAS BUTTON - Grade Submissions Offcanvas -->
    <a
      role="button"
      class="d-flex justify-content-center align-items-center mdi mdi-chevron-up text-warning bg-primary rounded-circle fs-1"
      style="aspect-ratio: 1/1; height: 50px; width: 50px;"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#gradeSubmissionsOffcanvas"
      aria-controls="offcanvasBottom">
    </a>
  </div>
  <GradeSubmissionForm />
    
  </section>
</template>
  
<script>
import GradeSubmissionForm from "../components/GradeSubmissionForm.vue"
import ParticipantCard from "../components/ParticipantCard.vue"
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
// import SubmissionCard from '../components/SubmissionCard.vue'
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { GRADE_FIELDS } from '../constants/index.js'
import { participantsService } from '../services/ParticipantsService'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"

export default {
  components: {
    // SubmissionCard,
    GradeSubmissionForm,
    ParticipantCard
  },
  setup() {
    let route = useRoute()

    const challengeRequirements = ref({
      requirements: [
        {
          step: '',
          completed: false,
          comment: ''
        }
      ]
    })

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

    return {

      // challenge,
      challenge: computed(() => AppState.activeChallenge),
      challengeRequirements,
      participant,

      user: computed(() => AppState.user),
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

</style>