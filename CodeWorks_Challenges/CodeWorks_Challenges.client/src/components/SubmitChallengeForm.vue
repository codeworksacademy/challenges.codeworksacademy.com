<template>
  <section class="container-fluid">
    <form @submit.prevent="createChallenge" id="submitChallengeForm">
      <div class="form-group">
        <label for="name">Challenge Name</label>
        <input type="text" class="form-control" id="name" v-model="editable.name" required>
      </div>
      <div class="form-group">
        <label for="description">Challenge Description</label>
        <textarea class="form-control" id="description" v-model="editable.description" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Create Challenge</button>
    </form>
  </section>
</template>
  
<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
import { Challenge } from "../models/Challenge.js"
import { challengesService } from "../services/ChallengesService.js"
import { useRoute } from 'vue-router';
import { Modal } from "bootstrap"

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup(props) {

    const editable = ref({
      name: '',
      description: '',
      //NOTE - Had to give the rest of the properties default values to get the form to work
      steps: [
        'Step 1'
      ],
      coverImg: 'https://placehold.it/200x200',
      supportLinks: [
        {
        name: '',
        url: ''
        }
      ],
      difficulty: 1,
      pointValue: 1,
      answers: [
        'answer 1'
      ],
      isCancelled: false

    })

    const router = useRoute()

    async function createChallenge() {
      try {
        const challenge = {
          name: editable.value.name,
          description: editable.value.description,
          coverImg: editable.value.coverImg,
          difficulty: editable.value.difficulty,
          pointValue: editable.value.pointValue,
        }
        await challengesService.createChallenge(challenge)
        Modal.getOrCreateInstance('#submitChallengeForm').hide()
        Pop.toast('Challenge Created')
        editable.value = {
          name: '',
          description: '',
          coverImg: 'https://placehold.it/200x200',
          difficulty: 1,
          pointValue: 1,
        }
        router.push({ name: 'EditChallenge', params: { challengeId: AppState.activeChallenge?.id } })
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    }

    onMounted(() => {

    })
    return {
      editable,
      createChallenge

    } 
  }
}
</script>

<style scoped lang="scss">

</style>