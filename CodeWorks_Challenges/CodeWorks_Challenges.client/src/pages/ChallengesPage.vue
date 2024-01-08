<template>
  <section class="container-fluid pt-5 g-0">
    <span class="text-danger">Only published challenges should be showed on the challenge page</span>
    <div class="col-12 d-flex justify-content-end">
      <div class="col-4 d-flex create-challenge-card flex-column" style="position: relative; height: 14vh;right: 5rem">
        <span class="submission-subtitle text-uppercase" style="">Gain Reputation</span>
        <a ref="challenge" id="createChallengeButton" class="create-challenge" type="button" role="button"
          data-bs-target="#createChallengeForm" data-bs-toggle="modal" aria-label="Go to Active Challenge Modal"
          title="Create a new challenge" style="">Create a Challenge</a>
      </div>
    </div>
    <div class="col-12 d-flex justify-content-start mb-2 ps-4" style="color: var(--text-primary);">
      <h5 class="ms-5 text-light">Search Challenges</h5>
    </div>
    <div class="col-12 d-flex justify-content-center align-items-center">
      <div class="col-6 ms-4 mb-4 pb-1 ps-5">
        <!-- <form @submit.prevent="findChallenges">
          <div class="input-group">
            <i role="button" type="submit" class="btn mdi mdi-magnify text-light" style="transform: scale(1.6)"
              id="search"></i>
            <input v-model="search.name" type="text" name="name" id="name" class="form-control bg-main search-input me-1"
              style="width: 85%" placeholder="Search active challenges..." aria-label="Search by name"
              aria-describedby="search" />
          </div>
        </form> -->
      </div>
      <div class="col-6 d-flex justify-content-center mb-4">
        <div class="dropdown m-2">
          <!-- <button class="btn filter-button text-uppercase dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Filter Status
          </button>
          <ul class="dropdown-menu">
            <li @click="filterType('newest')" class="dropdown-item">Newest to Oldest</li>
            <li @click="filterType('oldest')" class="dropdown-item">Oldest to Newest</li>
            <li @click="filterType('cancelled')" class="dropdown-item">Cancelled</li>
          </ul> -->
        </div>
        <select v-model="filterDifficulty" @change="routeToDifficulty" name="difficulty" id="difficulty"
          class="col-2 select-category text-center text-uppercase p-3">
          <option class="disabled-option" :value="''" disabled>All Difficulties</option>
          <option class="option-item" @click="filterDifficulty = ''" :value="''">All</option>
          <option class="option-item" v-for="difficulty in difficultyTypes" :key="difficulty" :value="difficulty">{{ difficulty }}</option>
        </select>
        <select v-model="filterCategory" @change="routeToCategory" name="category" id="category"
          class="col-2 select-category text-center text-uppercase p-3">
          <option class="disabled-option" :value="''" disabled>All Categories</option>
          <option class="option-item" @click="filterCategory = ''" :value="''">All</option>
          <option class="option-item" v-for="option in categoryTypes" :key="option" :value="option">{{ option }}</option>
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
  </section>
  <router-view />
</template>

<script>
import Pop from '../utils/Pop'
import { useRouter } from 'vue-router'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { computed, onMounted, ref } from 'vue'
import { CATEGORY_TYPES } from '../constants/index'
import { challengesService } from '../services/ChallengesService'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"

export default {

  setup() {
    const router = useRouter()
    const search = ref({})
    const filterCategory = ref('')
    const filterDifficulty = ref('')
    const categoryTypes = ref(Object.values(CATEGORY_TYPES))
    const difficultyTypes = computed(() => {
      const difficulties = []
      AppState.challenges.forEach(c => {
        if (!difficulties.includes(StrDifficultyNum(c.difficulty).text)) {
          difficulties.push(StrDifficultyNum(c.difficulty).text)
        }
      })
      return difficulties
    
    })


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
      logger.log(difficultyTypes.value)
    })

    return {
      router,
      search,
      filterCategory,
      filterDifficulty,
      categoryTypes,
      difficultyTypes,

      categorizedChallenges: computed(() => {
        if (!filterCategory.value) {
          return AppState.challenges
        }
        return AppState.challenges.filter(c => c.category === filterCategory.value)
      }),

      challengesByDifficulty: computed(() => {
        if (!filterDifficulty.value) {
          return AppState.challenges
        }
        return AppState.challenges.filter(c => StrDifficultyNum(c.difficulty).text === filterDifficulty.value)
      }),

      routeToCategory() {
        try {
          if (!filterCategory.value) {
            router.push({ name: 'Challenges' })
            return
          }
          router.push({ name: 'ChallengeCategory', params: { category: filterCategory.value } })
        } catch (error) {
          logger.error(error)
          Pop.error(error)
        }
      },

      routeToDifficulty() {
        try {
          if (!filterDifficulty.value) {
            router.push({ name: 'Challenges' })
            return
          }
          router.push({ name: 'ChallengeDifficulty', params: { difficulty: filterDifficulty.value } })
        } catch (error) {
          logger.error(error)
          Pop.error(error)
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
  background-color: var(--bg-sub);
  outline: 1px solid var(--border-dark);
  border-radius: 10px;
  color: var(--text-main);
  height: 8vh;
  padding: 1rem;
  text-decoration: none;
  transition: all .3s ease;

  .submission-subtitle {
    color: var(--shadow-green);
    font-size: .9rem;
    font-weight: 500;
    margin-top: .5rem;
    margin-bottom: .5rem;
  }

  >a {
    color: var(--shadow-blue);
    font-size: 1.1rem;
    font-weight: 500;
    transition: all .3s ease;
    text-decoration: none;
  }

  &>:hover {
    color: var(--shadow-blue);
    transition: all .3s ease;
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

h6 {
  color: var(--text-sub);
  font-size: 1.2rem;
  font-weight: 500;
}
</style>