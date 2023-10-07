<template>
  <section class="container-fluid">
    <form @submit.prevent="createChallenge">
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
import { useRoute, useRouter } from 'vue-router';
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
      description: ''
    })

    const router = useRouter()

    async function createChallenge() {
      try {
        const newChallenge = { ...editable.value, ...props.challenge }
        await challengesService.createChallenge(newChallenge)
        Pop.toast('Challenge Created')
        router.push({ name: 'EditChallenge', params: { challengeId: AppState.activeChallenge?.id } })
        Modal.getOrCreateInstance('#submitChallengeForm').hide()
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