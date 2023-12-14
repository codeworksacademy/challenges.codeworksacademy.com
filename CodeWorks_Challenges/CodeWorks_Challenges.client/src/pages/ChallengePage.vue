<template>
  <section class="container-fluid position-relative pt-5">
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
        <h5 class="text-center">Search Challenges</h5>
      </div>
      <div class="col-12">
        <form
          @submit.prevent="findChallenges"
        >
        <div class="input-group mb-3">
          <input
            v-model="search.name"
            type="text"
            name="name"
            id="name"
            class="form-control"
            placeholder="Search by name"
            aria-label="Search by name"
            aria-describedby="search"
          />
          <button
            type="submit"
            class="btn btn-outline-secondary"
            id="search"
          >
            Search
          </button>
        </div>
      </form>
      </div>
      <div class="row">
        <div class="col-12 d-flex justify-content-end pe-4">
          <select v-model="filterBy" name="category" id="category" class="col-2 position-relative bg-primary rounded-3 me-1 text-center text-light text-uppercase" style="top: .55rem; height:37px">
            <option :value="''" disabled>Categories</option>
            <option @click="filterBy = ''" :value="''">All</option>
            <option @click="filterBy = 'full stack'" :value="'full stack'">Full Stack</option>
            <option @click="filterBy = 'front end'" :value="'front end'">Front End</option>
            <option @click="filterBy = 'back end'" :value="'back end'">Back End</option>
            <option @click="filterBy = 'puzzles'" :value="'puzzles'">Puzzles</option>
            <option @click="filterBy = 'data structures'" :value="'data structures'">Data Structures</option>
            <option @click="filterBy = 'style and design'" :value="'style and design'">Style and Design</option>
            <option @click="filterBy = 'other'" :value="'other'">Other</option>
          </select>
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
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import ChallengeCard from '../components/ChallengeCard.vue'
import SelectChallengeCategory from '../components/ChallengePage/SelectChallengeCategory.vue'
import { challengesService } from "../services/ChallengesService.js"
import { useRouter } from "vue-router"
import { loadPage } from "../router.js"

export default {

  components: {
    ChallengeCard,
    SelectChallengeCategory
  },

  setup() {
    const search = ref({})
    const filterBy = ref('')
    const router = useRouter()

    async function findChallenges() {
      try {
        const nameQuery = search.value.name
        await challengesService.findChallenges(nameQuery)
        search.value = {}
        loadPage(`?name=${nameQuery}`)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

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
      search,
      filterBy,
      challenge: computed(() => AppState.activeChallenge),
      challenges: computed(() => {
        if (!filterBy.value) {
          return AppState.challenges
        }
          return AppState.challenges.filter(c => c.category === filterBy.value)
      }),
      filteredChallenges: computed(() => {
        if (!search.value) {
          return AppState.challenges
        }
        return AppState.challenges.filter(c => c.name === search.value.name)
      }),

      findChallenges,

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
  // * {
  //   border: 1px red solid
  // }
</style>