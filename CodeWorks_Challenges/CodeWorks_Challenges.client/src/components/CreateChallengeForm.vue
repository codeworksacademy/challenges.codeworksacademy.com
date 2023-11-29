<template>
  <section v-if="user.isAuthenticated" class="container-fluid">
    <form @submit.prevent="createChallenge" id="createChallengeForm">
      <div class="form-group">
        <label for="name">Challenge Name</label>
        <input type="text" class="form-control" id="name" v-model="editable.name" required> 
      </div>
      <div class="form-group">
        <label for="description">Challenge Description</label>
        <textarea class="form-control" id="description" v-model="editable.description" required></textarea>
      </div>
      <label for="category">Category</label>
      <select class="form-group form-select mb-3" aria-label="Category Selection" v-model="editable.category">
            <option selected>Select Category</option>
            <option value="full stack">Full-Stack</option>
            <option value="front end">Frontend</option>
            <option value="back end">Backend</option>
            <option value="puzzles">Puzzle</option>
            <option value="data structures">Data Structures</option>
            <option value="style and design">Style and Design</option>
            <option value="other">Other</option>
      </select>
      <button type="submit" class="btn btn-primary">Get Started</button>
    </form>
  </section>
  <section v-if="!user.isAuthenticated">
    <h1>Error: You are not authenticated</h1>
  </section>
</template>
  
<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
import { Challenge } from "../models/Challenge.js"
import { challengesService } from "../services/ChallengesService.js"
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"
import { useRouter, useRoute } from 'vue-router';
import { Modal } from "bootstrap"

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: false
    }
  },
  setup(props) {

    const editable = ref({
      name: '',
      description: '',
      coverImg: 'https://i.ibb.co/c21hFZN/card-gradient.png',
    })

    const route = useRoute()
    const router = useRouter()

    // onMounted(() => {
    //   editable.value.name = props.challenge.name || '';
    //   editable.value.description = props.challenge.description || '';
    // });

    async function createChallenge() {
      try {
        const newChallenge = editable.value
        editable.value = { ...editable.value, ...props.challenge }
        await challengesService.createChallenge(newChallenge)
        const moderatorData = {
            challengeId: AppState.activeChallenge?.id,
            accountId: AppState.user.id
          }
        await challengeModeratorsService.createModeration(moderatorData)
        Modal.getOrCreateInstance('#createChallengeForm').hide()
        Pop.toast('Challenge Created')
        router.push(
          { name: 'ChallengeEditor',
            params: {
              challengeId: AppState.activeChallenge?.id
            }
          })
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    }

    return {
      editable,
      createChallenge,

      user: computed(() => AppState.user),
    } 
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/_variables.scss';


</style>