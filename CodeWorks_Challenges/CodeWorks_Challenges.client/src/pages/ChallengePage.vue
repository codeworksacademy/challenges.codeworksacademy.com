<template>
  <section class="container-fluid position-relative bg-secondary pt-5">
    <div class="row">
      <div class="col-12 d-flex justify-content-end position-absolute top-0 right-2 p-1">
        <a
          ref="challenge"
          id="createChallengeButton"
          type="button"
          role="button"
          data-bs-target="#createChallengeForm"
          data-bs-toggle="modal"
          aria-label="Go to Active Challenge Modal"
          class="mdi mdi-plus-circle border-none fs-1"
          title="Create a new challenge"
        >
        </a>
      </div>
      
      <div class="col-12 mb-5" style="color: var(--text-primary);">
        <h1 class="text-center">Active Challenges</h1>
      </div>
      <div class="row">
        <div class="col-12 d-flex justify-content-end pe-4">
          <div class="dropdown m-2">
            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Filter Status
            </button>
            <ul class="dropdown-menu">
              <li @click="filterType('newest')" class="dropdown-item">Newest to Oldest</li>
              <li @click="filterType('oldest')" class="dropdown-item">Oldest to Newest</li>
              <li @click="filterType('cancelled')" class="dropdown-item">Cancelled</li>
            </ul>
          </div>
          <div class="dropdown m-2">
            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Filter Difficulty
            </button>
            <ul class="dropdown-menu">
              <li @click="filterDifficulty('Easy')" class="dropdown-item">Easy</li>
              <li @click="filterDifficulty('Medium')" class="dropdown-item">Medium</li>
              <li @click="filterDifficulty('Hard')" class="dropdown-item">Hard</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div 
          v-for="(c, index) in challenges"
          :key="index"
          class="col-12 px-3 mb-1 position-relative"
        >
          <ChallengeCard :challenge="c" />
        </div>
      </div>
      <div class="row justify-content-evenly">
        <ul class="pagination col-md-5">
            <li class="page-item"><a class="page-link" href="#">Previous</a></li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">Next</a></li>
          </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import ChallengeCard from '../components/ChallengeCard.vue'
import { challengesService } from "../services/ChallengesService.js"
import { Modal } from "bootstrap"

export default {

  components: {
    ChallengeCard,
  },

  setup() {

    async function getAllChallenges() {
      try {
        await challengesService.getAllChallenges()
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    onMounted(() => {
      getAllChallenges()
    })

    return {
      challenges: computed(() => AppState.challenges),
      async filterDifficulty(difficulty){
        try {
          await challengesService.filterDifficulty(difficulty);
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      },

      async filterType(type){
        try {
          await challengesService.filterType(type);
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      }
    }

  }
}
</script>

<style scoped lang="scss">
  * {
    border: 1px red solid
  }
</style>