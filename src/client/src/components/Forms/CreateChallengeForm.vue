<template>
  <section v-if="user.isAuthenticated" class="container-fluid">
    <form @submit.prevent="createChallenge" id="createChallengeForm">
      <div class="row">
        <div class="col-lg-4 mb-2">
          <label class="visually-hidden" for="name">Challenge Name</label>
          <input type="text" class="form-control" id="name" v-model="editable.name" required placeholder="Challenge Name">
        </div>
        <div class="col-lg-4 mb-2">
          <label class="visually-hidden" for="category">Category</label>
          <select class="form-control " aria-label="Category Selection" v-model="editable.category">
            <option :value="''" selected disabled>Select Category</option>
            <option value="full stack">Full-Stack</option>
            <option value="front end">Frontend</option>
            <option value="back end">Backend</option>
            <option value="puzzles">Puzzle</option>
            <option value="data structures">Data Structures</option>
            <option value="style and design">Style and Design</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="col-lg-4 mb-2">
          <button type="submit" class="btn btn-primary">Get Started</button>
        </div>
      </div>
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
import { useRouter } from 'vue-router';

export default {
  setup() {

    const editable = ref({
      name: '',
      category: '',
      coverImg: 'https://i.ibb.co/c21hFZN/card-gradient.png',
    })

    const router = useRouter()

    async function createChallenge() {
      try {
        await challengesService.createChallenge(editable.value)
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

<style scoped lang="scss"></style>