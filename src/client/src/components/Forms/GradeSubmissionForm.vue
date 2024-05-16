<template>
  <section v-if="participant" class="container-fluid text-light">
    <div class="row justify-content-center align-items-center">
      <div class="col-12 d-flex flex-column justify-content-center align-items-center">
        <h1 class="text-center">Grade Challenge for {{ participant.profile?.name }}</h1>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <p>Submission Source Code Link: </p>
        <a :href="participant.submission" target="_blank" placeholder="Source Code Link"
          class="text-decoration-none text-truncate mb-3 ms-2">
          {{ participant.submission }}
        </a>
      </div>
      <form @submit.prevent="gradeParticipant" class="row">
        <div class="col-12 d-flex justify-content-center align-items-center">
          <ol>
            <div class="d-flex justify-content-end">
              <span class="text-uppercase fw-bold p-3">
                Completed Steps: {{ checkedReqs }} / {{ totalReqs }}
              </span>
            </div>
            <li v-for="(requirement, index) in editable.requirements" :key="index">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" :id="`field-${requirement.description}`"
                  v-model="requirement.isComplete" :value="requirement.isComplete" @change="toggleRequirement(requirement)">
                <label class="form-check-label" :for="`field-${requirement.description}`">{{ requirement.description
                }}</label>
              </div>
              <hr class="mb-4" style="color: white; opacity: .4;" />
            </li>
          </ol>
        </div>
        <div class="col-12 form-group px-5 mb-5" v-if="editable.priorFeedback.length == 0">
          <label for="feedback" class="form-label">Prior Feedback</label>
          <ul>
            <!-- TODO Turn feedback into a component and insert in place of the below -->
            <li v-for="prior in editable.priorFeedback">{{ prior.comment }}</li>
          </ul>
        </div>
        <div class="col-12 form-group px-5 mb-5">
          <label for="feedback" class="form-label">Feedback</label>
          <input v-model="editable.feedback" type="text" name="feedback" id="feedback" placeholder="Provide feedback.."
            class="form-control">
        </div>
        <div class="col-12 text-center mt-3">
          <h4>Set status for {{ participant.profile?.name }}</h4>
        </div>
        <div class="d-flex justify-content-center align-items-center my-3">
          <div class="">
            <div class="col-12 d-flex justify-content-center align-items-center input-group px-5 mb-5">
              <label class="input-group-text" for="challengeStatus">Status</label>
              <select v-model="editable.status" name="status" id="status" placeholder="Status"
                class="input-box form-select">
                <option :value="null" selected disabled>Select a status</option>
                <option value="completed">Completed</option>
                <option value="returned for review">Returned for Review</option>
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
import { AppState } from '../../AppState.js'
import { logger } from '../../utils/Logger.js'
import { computed, onMounted, ref } from 'vue'
import { challengesService } from '../../services/ChallengesService.js'
import { ChallengeParticipant } from '../../models/ChallengeParticipant.js'
import Pop from "../../utils/Pop.js"

export default {
  props: { participant: { type: ChallengeParticipant, required: true } },

  setup(props) {
    const editable = ref({
      requirements: props.participant.requirements,
      priorFeedback: props.participant.feedback,
      feedback: null,
      status: null
    });

    onMounted(() => {
      logger.log('Participant Requirements for ', props.participant.profile.name, ': ', props.participant.requirements);
    })

    return {
      editable,
      checkedReqs: computed(() => props.participant.requirements.filter(r => r.isComplete).length),
      totalReqs: computed(() => props.participant.requirements.length),
      challenge: computed(() => AppState.ChallengeState.challenge),

      toggleRequirement(requirement) {
        requirement = !requirement;
        props.participant.requirements.forEach(r => {
          if (r.isComplete === true) {
            logger.log(
              `[NEW DATA] =>
                📝 COMPLETED REQUIREMENT: {
                💭 DESCRIPTION: ${r.description}
                📈 GRADE: ${this.checkedReqs} / ${this.totalReqs}
              }`
            );
          }
        });
      },

      async gradeParticipant() {
        try {
          const participantResults = {
            ...editable.value,
            participantId: props.participant.id,
            challengeId: props.participant.challengeId
          };
          await challengesService.gradeParticipant(participantResults);
          Pop.success(`${props.participant.profile?.name} has been graded! Result: ${editable.value.status}`)
        } catch (error) {
          Pop.error('[GRADE SUBMISSION FORM] gradeParticipant:: ' + error);
        }
      }

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