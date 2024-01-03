<template>
  <div class="text-white container-fluid">
    <section class="row">
      <div class="col-12">
        <p>
          Please submit a link to your source code (i.e., Github Repository).
        </p>
      </div>
      <div class="col-12">
        <form @submit.prevent="submitAnswer()">
          <label for="body" class="text-light form-label">
            Link
          </label>
          <input v-model="editable.body" type="url" name="body" id="body" placeholder="Source Code Link"
            class="form-control bg-light">
          <div class="text-end mt-3">
            <button class="btn btn-success" type="submit" title="Submit Answer">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>


<script>
import { useRoute } from 'vue-router';
import { logger } from '../../utils/Logger';
import Pop from '../../utils/Pop';
import { ref } from 'vue';
import { Modal } from 'bootstrap';


export default {
  setup() {
    const editable = ref({})

    const route = useRoute()

    return {
      editable,

      async submitAnswer() {
        try {
          const answerData = { body: editable.value.body, challengeId: route.params.challengeId }
          // 🚨🚨🚨 Why is this an answer service? Answer model is not a thing. Move to participant service?
          // probably participantsService.(updateParticipant) or updateParticipantProgress
          // await answersService.createAnswer(answerData)

          editable.value = {}

          Modal.getOrCreateInstance('#submitAnswerModal').hide()

          Pop.success('answer submitted!')
        } catch (error) {
          logger.log(error.message)
          Pop.error(error.message)
        }
      }
    }
  }
}
</script>