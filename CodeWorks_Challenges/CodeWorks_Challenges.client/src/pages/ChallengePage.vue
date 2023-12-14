<template>
  <section class="container-fluid pt-5 g-0">
    <div class="col-12 d-flex justify-content-end">
      <div class="col-4 d-flex create-challenge-card flex-column" style="position: relative; height: 14vh;right: 5rem">
        <span class="submission-subtitle" style="">Earn your Reputation</span>
        <a ref="challenge" id="createChallengeButton" type="button" role="button" data-bs-target="#createChallengeForm"
          data-bs-toggle="modal" aria-label="Go to Active Challenge Modal" title="Create a new challenge" style="">Create
          a Challenge</a>
      </div>
    </div>

    <div class="col-12 d-flex justify-content-start mb-2 ps-4" style="color: var(--text-primary);">
      <h5 class="ms-5 text-light">Search Challenges</h5>
    </div>
    <div class="col-12 d-flex justify-content-center align-items-center">
      <div class="col-6 ms-4 mb-4 pb-1 ps-5">
        <form @submit.prevent="findChallenges">
          <div class="input-group">
            <i role="button" type="submit" class="btn mdi mdi-magnify text-light" style="transform: scale(1.6)"
              id="search"></i>
            <input v-model="search.name" type="text" name="name" id="name" class="form-control bg-main search-input me-1"
              style="width: 85%" placeholder="Search active challenges..." aria-label="Search by name"
              aria-describedby="search" />
          </div>
        </form>
      </div>
      <div class="col-6 d-flex justify-content-center mb-4">
        <div class="dropdown m-2">
          <button class="btn filter-button text-uppercase dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Filter Status
          </button>
          <ul class="dropdown-menu">
            <li @click="filterType('newest')" class="dropdown-item">Newest to Oldest</li>
            <li @click="filterType('oldest')" class="dropdown-item">Oldest to Newest</li>
            <li @click="filterType('cancelled')" class="dropdown-item">Cancelled</li>
          </ul>
        </div>
        <div class="dropdown m-2">
          <button class="btn filter-button text-uppercase dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Filter Difficulty
          </button>
          <ul class="dropdown-menu">
            <li @click="filterDifficulty('Easy')" class="dropdown-item">Easy</li>
            <li @click="filterDifficulty('Medium')" class="dropdown-item">Medium</li>
            <li @click="filterDifficulty('Hard')" class="dropdown-item">Hard</li>
          </ul>
        </div>
        <select v-model="filterBy" name="category" id="category"
          class="col-2 select-category text-center text-uppercase p-3">
          <option class="disabled-option" :value="''" disabled>Categories</option>
          <option class="option-item" @click="filterBy = ''" :value="''">All</option>
          <option class="option-item" v-for="option in categoryTypes" :key="option" @click="filterBy = option"
            :value="option">{{ option }}</option>
        </select>
      </div>
    </div>
    <div class="col-12 challenge-keys d-flex justify-content-center align-items-center text-uppercase">
      <div class="col-4">
        <h6>Challenge Name</h6>
      </div>
      <div class="col-2">
        <h6>Difficulty</h6>
      </div>
      <div class="col-5 d-flex justify-content-center align-items-center">
        <div class="col-4">
          <h6>Rating</h6>
        </div>
        <div class="col-4">
          <h6>Points</h6>
        </div>
        <div class="col-4">
          <h6>User Solves</h6>
        </div>
      </div>
    </div>
    <div class="accordion accordion-flush accordion-categories" id="accordionFlush">
      <h2 v-for="type in categoryTypes" :key="type" class="accordion-item">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
          data-bs-target="#flush-collapse" aria-expanded="false" aria-controls="collapse">{{ type }}</button>
      </h2>
      <div id='flush-collapse' class="accordion-collapse collapse" data-bs-parent="#accordionFlush">
        <div class="accordion-body">
          <ChallengeCard :challenge="type" />
        </div>
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
import { loadPage } from "../router.js"
import { CATEGORY_TYPES } from "../constants/index.js"
import MostPopularChallengeCard from '../components/MostPopularChallengeCard.vue'

export default {
  components: { ChallengeCard, SelectChallengeCategory, MostPopularChallengeCard, },

  setup() {
    const search = ref({})
    const filterBy = ref('')
    const categoryTypes = ref(Object.values(CATEGORY_TYPES))

    async function findChallenges() {
      try {
        const nameQuery = search.value.name
        logger.log(nameQuery)
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
      categoryTypes,
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
      trendingChallenges: computed(() => {
        AppState.challenges.sort((trendingChallenges1, trendingChallenges2) =>
          trendingChallenges2.participantCount - trendingChallenges1.participantCount)
        return AppState.challenges[0]
      }),
      findChallenges,

      async filterDifficulty(difficulty) {
        try {
          await challengesService.filterDifficulty(difficulty);
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      },

      async filterType(type) {
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
@import url('../assets/scss/_variables.scss');

.container-fluid {
  --bs-gutter-x: 0;
  overflow-x: hidden;
}

.create-challenge-card {
  background-color: var(--bg-main);
  border: 1px solid var(--border-dark);
  border-radius: 10px;
  color: var(--text-main);
  height: 8vh;
  padding: 1rem;

  .submission-subtitle {
    color: var(--shadow-green);
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  &:hover {
    background-color: var(--bg-sub);
    border: 1px solid var(--border-dark);
    color: var(--text-main);
  }
}

.search-input {
  background-color: var(--bg-main);
  border: none;
  border-radius: 10px;
  color: var(--text-sub);
  font-size: 1.2rem;
  height: 37px;
  padding-left: 1rem;

  &:not(:focus) {
    background-color: var(--bg-main);

    &::placeholder {
      color: var(--text-sub);
      font-size: .95rem;
    }
  }
}

.filter-button {
  background-color: var(--bg-main);
  border: 1px solid var(--border-dark);
  border-radius: 10px;
  color: var(--text-main);
}

.select-category {
  width: 30%;
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  border-radius: 0;
  color: var(--text-main);
}

.challenge-keys {
  color: var(--text-sub);
  font-size: 1.2rem;
  font-weight: 500;

  h6 {
    font-size: 1.2rem;
    font-weight: 500;
  }
}</style>