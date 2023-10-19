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
          <label for="answer" class="text-light form-label">
            Link
          </label>
          <input v-model="editable.answer" type="url" name="answer" id="answer" placeholder="Source Code Link" class="form-control bg-light">
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
import { challengesService } from '../services/ChallengesService';
import { logger } from '../utils/Logger';
import Pop from '../utils/Pop';
import { ref } from 'vue';

export default {
  setup(){
    const editable = ref('')

    const route = useRoute()

    return {
      editable,

      async submitAnswer(){
        try {
          const answerData = editable.value

          const challengeId = route.params.challengeId

          await challengesService.submitAnswer(answerData, challengeId)

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


<style lang="scss" scoped>

</style>