<template>
  <section class="container-fluid pt-5 g-0">
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
      <div class="col-6 d-flex justify-content-between mb-4">
        <select class="col-3 select-type filter-button text-uppercase" v-model="filterBy" @change="filterType(filterBy)">
          <option class="text-center" value="" disabled>Filter By</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="cancelled">Cancelled</option>
        </select>
          <SelectChallengeDifficulty :filterBy="filterBy" />
          <SelectChallengeCategory :filterBy="filterBy" />
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
import SelectChallengeDifficulty from '../components/ChallengesPage/SelectChallengeDifficulty.vue'
import SelectChallengeCategory from "../components/ChallengesPage/SelectChallengeCategory.vue"

export default {
  components: {
    SelectChallengeDifficulty,
    SelectChallengeCategory
  },
  setup() {
    const router = useRouter()
    const search = ref({})
    const filterBy = ref('')

    async function findChallenges() {
      // try {
      //   const nameQuery = search.value.name
      //   logger.log(nameQuery)
      //   await challengesService.findChallenges(nameQuery)
      //   search.value = {}
      // } catch (error) {
      //   logger.error(error)
      //   Pop.toast(error, 'error')
      // }
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
      router,
      search,
      filterBy,

      challenges: computed(() => {
        if (!filterBy.value) {
          return AppState.challenges
        }
        return AppState.challenges.filter(c => c.category === filterBy.value || c.difficultyStr.text === filterBy.value)
      }),

      filterType(type) {
        if(type == 'newest'){
          AppState.challenges.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        }else if(type == 'oldest'){
          AppState.challenges.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        }else if(type == 'cancelled'){
          AppState.challenges.filter(c => c.isCancelled == true)
        }
      },
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

.select-type {
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