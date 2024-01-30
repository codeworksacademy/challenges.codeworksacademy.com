<template>
  <section v-if="participant" :key="participant?.id" class="container-fluid text-light">
    <div class="row justify-content-center align-items-center">
      <div class="col-12 d-flex flex-column justify-content-center align-items-center">
        <h1 class="text-center">Grade Challenge for {{ participant.profile.name }}</h1>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <p>Submission Source Code Link: </p>
        <a :href="participant.submission" target="_blank" placeholder="Source Code Link"
          class="text-decoration-none text-truncate mb-3 ms-2">
          {{ participant.submission }}
        </a>
      </div>
      <form @submit.prevent="gradeParticipant" class="row">
        <div v-if="participant?.challenge" class="col-12 d-flex justify-content-center align-items-center">
          <ol>
            <div class="d-flex justify-content-end align-items-center">
              <span class="text-uppercase fw-bold p-3">Completed Steps: {{ gradeCount }} / {{
                participant.requirements.length }}</span>
            </div>
            <li v-for="(requirement, index) in participant.requirements" :key="index">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" :id="`field-${requirement.description}`"
                  v-model="requirement.isComplete" :value="requirement.isComplete" @change="addGradePoint(index)">
                <label class="form-check-label" :for="`field-${requirement.description}`">{{ requirement.description
                }}</label>
              </div>
              <hr class="mb-4" style="color: white; opacity: .4;" />
            </li>
          </ol>
        </div>
        <div class="col-12 form-group px-5 mb-5">
          <label for="feedback" class="form-label">Feedback</label>
          <input v-model="editable.feedback" type="text" name="feedback" id="feedback" placeholder="Feedback"
            class="form-control bg-light">
        </div>
        <div class="col-12 text-center mt-3">
          <h4>Set status for {{ participant.profile.name }}</h4>
        </div>
        <div class="d-flex justify-content-center align-items-center my-3">
          <div class="">
            <div class="col-12 d-flex justify-content-center align-items-center input-group px-5 mb-5">
              <label class="input-group-text" for="challengeStatus">Status</label>
              <select v-model="editable.status" name="status" id="status" placeholder="Status"
                class="input-box form-select">
                <option value="null">Select a status</option>
                <option value="completed">Completed</option>
                <option value="returned_for_review">Returned for Review</option>
              </select>
              <button type="submit" class="btn btn-success">Submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>

  </section>
</template>

<script>
import { useRoute } from 'vue-router'
import { AppState } from '../../AppState'
import { logger } from '../../utils/Logger'
import { SUBMISSION_TYPES } from '../../constants'
import { formatEnum } from '../../utils/FormatEnum'
import { computed, ref } from 'vue'
import { challengesService } from '../../services/ChallengesService'
import { ChallengeParticipant } from '../../models/ChallengeParticipant'
import Pop from "../../utils/Pop.js"

export default {
  props: {
    participant: {
      type: ChallengeParticipant,
      required: true
    }
  },
  setup(props) {

    const route = useRoute()

    const editable = ref({
      challengeId: route.params.challengeId,
      accountId: props.participant.accountId,
      participantId: props.participant.id,
      challenge: props.participant.challenge,
      profile: props.participant.profile,
      requirements: props.participant.requirements,
      status: props.participant.status
    })

    const missedChecks = computed(() => editable.value.requirements.filter(r => !r.isComplete).length)

    const passingGrade = computed(() => editable.value.requirements.filter(r => r.isComplete).length * .8)

    async function gradeParticipant() {
      logger.log(editable.value)
      try {
        const newGrade = editable.value
        newGrade.status = missedChecks.value < passingGrade.value
        ? SUBMISSION_TYPES.COMPLETED
        : SUBMISSION_TYPES.RETURNED_FOR_REVIEW
        await challengesService.gradeParticipant(newGrade)
        Pop.success(`${editable.value.profile?.name} has been graded! Result: ${editable.value.status}`)
      } catch (error) {
        logger.error(error)
      }
    }

    function addGradePoint(index) {
      // editable.value.requirements.map(
      //   r => ({ ...r, isComplete: false })
      // )
      editable.value.requirements[index].isComplete = !editable.value.requirements[index].isComplete;
      editable.value.grade = editable.value.requirements.filter(r => r.isComplete).length;

      editable.value.requirements.forEach(r => {
        if (r.isComplete === true) {
          logger.log(
            `[NEW DATA] =>
          📝 COMPLETED REQUIREMENT: {
            💭 DESCRIPTION: ${r.description}
            📈 GRADE: ${editable.value.grade} / ${editable.value.requirements.length}
            }`
          );
        }
      });
      logger.log(`Requirement Completed? ${editable.value.requirements[index].isComplete ? '✅ Complete' : '❌ Incomplete'}`);
    }

    return {
      editable,
      challenge: computed(() => AppState.ChallengeState.challenge),
      gradeCount: computed(() => editable.value.requirements.filter(r => r.isComplete).length),
      formatEnum,
      gradeParticipant,
      addGradePoint
    }
  }
}
</script>

<style scoped lang="scss">
ol {
  list-style: none;
  counter-reset: my-counter;
  width: 100%;
}

ol li {
  position: relative;
  margin-bottom: 10px;
  left: -10px;
}
</style>