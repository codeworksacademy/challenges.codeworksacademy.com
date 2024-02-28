<template>
  <section v-if="user.isAuthenticated" class="container-fluid">
    <form @submit.prevent="createChallenge" id="createChallengeForm">
      <div class="row justify-content-center">
        <div class="col-md-4 mb-2">
          <label class="visually-hidden" for="name">Challenge Name</label>
          <input type="text" class="form-control" id="name" v-model="editable.name" required placeholder="Challenge Name">
        </div>
        <div class="col-md-4 mb-2">
          <label class="visually-hidden" for="category">Category</label>
          <select class="form-control " aria-label="Category Selection" v-model="editable.category" required="true">
            <option :value="undefined" selected disabled>Select Category</option>
            <option value="full stack">Full-Stack</option>
            <option value="front end">Frontend</option>
            <option value="back end">Backend</option>
            <option value="puzzles">Puzzle</option>
            <option value="data structures">Data Structures</option>
            <option value="style and design">Style and Design</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="col-md-3 mb-2 d-flex justify-content-end justify-content-md-start">
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
import Pop from '../../utils/Pop.js'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router';
import { AppState } from '../../AppState.js'
import { challengesService } from '../../services/ChallengesService.js'

export default {
  setup() {
    const router = useRouter();
    const editable = ref({});

    return {
      editable,
      user: computed(() => AppState.user),

      async createChallenge() {
        try {
          if (!editable.value.category) {
            Pop.toast('Please select a category', 'info', 'top');
            return
          }
          await challengesService.createChallenge(editable.value);
          router.push(
            {
              name: 'Challenge.challengeEditor',
              params: { challengeId: AppState.ChallengeState.challenge.id }
            })
        }
        catch (error) {
          Pop.error('[CREATE CHALLENGE FORM] createChallenge:: ' + error);
        }
      }

    }
  }
}
</script>

<style scoped lang="scss"></style>