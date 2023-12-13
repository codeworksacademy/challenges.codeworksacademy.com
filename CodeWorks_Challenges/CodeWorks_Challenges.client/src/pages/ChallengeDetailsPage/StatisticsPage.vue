<template>
  <section class="container-fluid">

    <div v-if="challenge" :key="challenge.id" class="p-3">
      <div class="d-flex col-12">
        <div class="col-6 d-flex flex-column justify-content-start align-items-center">
          <h5 class="">Success Rate: {{ participantCompletionRate }} </h5>
          <h5>Active Participants: {{ activeParticipantCount }}</h5>
          <h5>Total Submissions: {{ totalSubmissions }}</h5>
          <h5 v-if="participant">Average Time to Complete: {{ timeToComplete }}</h5>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-center">
          <p v-html="difficulty.html"></p>
        </div>
      </div>
      <section>
        <div class="col-12 d-flex justify-content-between align-items-center">
          <div v-for="p in participants" :key="p.id" class="col-2 p-3">
            <div v-if="p.status === 'submitted'">
              <ParticipantCard :participant="p" />
            </div>
            <div v-else class="not-submitted">
              <ParticipantCard :participant="p" />
            </div>
          </div>
        </div>
      </section>
    </div>

  
  </section>
</template>
  
<script>
import ParticipantCard from "../../components/ParticipantCard.vue"
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../../AppState'
import Pop from "../../utils/Pop.js"
import { logger } from "../../utils/Logger.js"  
import { challengesService } from '../../services/ChallengesService'
import { useRoute } from 'vue-router'
import { participantsService } from '../../services/ParticipantsService'
import { StrDifficultyNum } from "../../utils/StrDifficultyNum.js"
import { SUBMISSION_TYPES } from "../../constants/index.js"

export default {
  components: {
    ParticipantCard
  },
  setup() {
    let route = useRoute()

    const filterBy = ref('')
    const editable = ref({
      accountId: AppState.user.id,
      challengeId: AppState.activeChallenge?.id,
      submission: '',
      status: SUBMISSION_TYPES,
      createdAt: AppState.participants.createdAt,
      updatedAt: AppState.participants.updatedAt
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

    function isModeratorStatus() {
      const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }

    const participant = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.user.id)
    })

    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
    })

    return {
      filterBy,
      editable,
      participant,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      myModerations: computed(() => AppState.moderators.filter(m => m.accountId === AppState.account.id)),
      participants: computed(() => AppState.participants),
      isParticipant: computed(() => {
        return AppState.participants.find(p => p.accountId === AppState.user.id)
      }),
      participantFilter: computed(() => {
        if (!filterBy.value) {
          return AppState.participants
        } else {
          return AppState.participants.filter(p => p.status === filterBy.value)
        }
      }),
      difficulty: computed(() =>
        StrDifficultyNum(AppState.activeChallenge.difficulty)
      ),
      participantCompletionRate: computed(() => {
        const participants = AppState.participants
        const submissionTypes = participants.filter(p => p.status === SUBMISSION_TYPES ? p.status === SUBMISSION_TYPES : p.status !== SUBMISSION_TYPES['removed', 'left'])
        const completed = participants.filter(p => p.status === 'completed')
        const total = submissionTypes.length
        const percentage = (completed.length / total) * 100
        return percentage.toFixed(2) + '%'
      }),
      activeParticipantCount: computed(() => {
        const participants = AppState.participants
        const activeParticipants = participants.filter(p => p.status === 'submitted' || p.status === 'started')
        return activeParticipants.length
      }),
      totalSubmissions: computed(() => {
        const participants = AppState.participants
        const submissions = participants.filter(p => p.status === 'submitted' || p.status === 'completed')
        const total = submissions.length
        return total
      }),
      timeToComplete: computed(() => {
        const participants = AppState.participants;
        const completed = participants.filter(p => p.status === 'completed');
        if (completed.length === 0) {
          return 0;
        }
        const totalTime = completed.reduce((acc, p) => acc + (p.updatedAt - p.createdAt), 0);
        const averageTime = totalTime / completed.length;

        const days = Math.floor(averageTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((averageTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((averageTime % (1000 * 60 * 60)) / (1000 * 60));

        logger.log(days, hours, minutes)
        return `${days} days, ${hours} hours, ${minutes} minutes`;
      }),

    } 
  }
}
</script>