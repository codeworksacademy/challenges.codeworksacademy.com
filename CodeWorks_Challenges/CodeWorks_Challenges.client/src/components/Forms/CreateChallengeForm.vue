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
import { computed, ref } from 'vue'
import { AppState } from '../../AppState'
import Pop from '../../utils/Pop'
import { Challenge } from '../../models/Challenge'
import { challengesService } from '../../services/ChallengesService'
import { challengeModeratorsService } from '../../services/ChallengeModeratorsService'
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap'

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

    const router = useRouter()

    async function createChallenge() {
      try {
        const newChallenge = editable.value
        editable.value = { ...editable.value, ...props.challenge }
        await challengesService.createChallenge(newChallenge)
        const moderatorData = {
          challengeId: AppState.ChallengeState.challenge?.id,
          accountId: AppState.user.id
        }
        await challengeModeratorsService.createOwnedChallengeModeration(moderatorData)
        Modal.getOrCreateInstance('#createChallengeForm').hide()
        Pop.toast('Challenge Created')
        router.push(
          {
            name: 'Challenge.challengeEditor',
            params: {
              challengeId: moderatorData.challengeId
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