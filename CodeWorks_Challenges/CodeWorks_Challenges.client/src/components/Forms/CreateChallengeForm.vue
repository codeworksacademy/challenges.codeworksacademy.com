<template>
  <section v-if="user.isAuthenticated" class="container-fluid">
    <form @submit.prevent="createChallenge" id="createChallengeForm">
      <aside class="form-box">
        <div class="input-group form-group mb-3">
          <label class="input-group-text" for="name">Challenge Name</label>
          <input type="text" class="form-control" id="name" v-model="editable.name" required>
        </div>
        <div class="input-group form-group mb-3">
          <label class="input-group-text" for="description">Challenge Description</label>
          <input type="text" class="form-control" id="description" v-model="editable.description" required />
        </div>
        <div class="input-group mb-3">
          <label class="input-group-text" for="category">Category</label>
          <select class="input-box form-group form-select" aria-label="Category Selection" v-model="editable.category">
            <option selected>Select Category</option>
            <option value="full stack">Full-Stack</option>
            <option value="front end">Frontend</option>
            <option value="back end">Backend</option>
            <option value="puzzles">Puzzle</option>
            <option value="data structures">Data Structures</option>
            <option value="style and design">Style and Design</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="text-center">
          <button type="submit" class="btn btn-primary mb-4">Get Started</button>
        </div>
      </aside>
    </form>
  </section>
  <section v-if="!user.isAuthenticated">
    <h1>Error: You are not authenticated</h1>
  </section>
</template>
  
<script>
import { computed, ref } from 'vue'
import { AppState } from '../../AppState'
import Pop from '../../utils/Pop'
import { challengesService } from '../../services/ChallengesService'
import { challengeModeratorsService } from '../../services/ChallengeModeratorsService'
import { useRouter, useRoute } from 'vue-router';
import { Modal } from 'bootstrap'

export default {
  setup() {

    const editable = ref({
      name: '',
      description: '',
      coverImg: 'https://i.ibb.co/c21hFZN/card-gradient.png',
    })

    const route = useRoute()
    const router = useRouter()

    async function createChallenge() {
      try {
        const newChallenge = editable.value
        await challengesService.createChallenge(newChallenge)
        
        Modal.getOrCreateInstance('#createChallengeForm').hide()
        Pop.toast('Challenge Created')
        router.push(
          {
            name: 'Challenge.challengeEditor',
            params: {
              challengeId: AppState.ChallengeState.challenge?.id
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
@import '../../assets/scss/_variables.scss';
</style>