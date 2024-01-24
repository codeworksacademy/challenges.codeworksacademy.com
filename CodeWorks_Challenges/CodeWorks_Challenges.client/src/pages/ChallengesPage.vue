<template>
  <section class="container-fluid pt-5 g-0">
    <div class="col-12 d-flex justify-content-end ps-5">
      <div class="col-4 d-flex create-challenge-card flex-column me-3" style="position: relative; height: 14vh;">
        <span class="submission-subtitle text-uppercase" style="">Gain Reputation</span>
        <a ref="challenge" id="createChallengeButton" class="create-challenge" type="button" role="button"
          data-bs-target="#createChallengeForm" data-bs-toggle="modal" aria-label="Go to Active Challenge Modal"
          title="Create a new challenge" style="">Create a Challenge</a>
      </div>
    </div>
    <!-- <div class="col-12 d-flex justify-content-start mb-2 ps-4" style="color: var(--text-primary);">
      <h5 class="ms-5 text-light">Search Challenges</h5>
    </div> -->
    <div class="col-12 d-flex justify-content-center align-items-center">
      <div class="col-md-6 ps-4 pe-3">
        <form @submit.prevent="findChallenges">
          <div class="input-group">
            <input v-model="search.name" type="text" name="name" id="name" class="form-control bg-main border search-input me-1"
              style="height: 3rem" placeholder="Search active challenges..." aria-label="Search by name"
              aria-describedby="search" />
          </div>
        </form>
      </div>
      <div class="col-12 col-md-6 mobile-query d-flex justify-content-center align-items-center me-3">
        <div class="col-4 d-flex justify-content-center align-items-center mb-3 mt-3 me-3">
          <select class="text-uppercase form-select bg-dark text-light" v-model="filterBy" @change="filterType(filterBy)">
            <option class="text-center" value="" disabled>Filter By</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="col-4 d-flex justify-content-center align-items-center mb-3">
          <SelectChallengeDifficulty :filterBy="challengesDifficulty" />
        </div>
        <div class="col-4 d-flex justify-content-center align-items-center mb-3">
          <SelectChallengeCategory :filterBy="challengesCategory" />
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
      challengesDifficulty: computed(() => {
        if (!filterBy.value) {
          return AppState.challenges
        }
        return AppState.challenges.filter(c => c.difficultyStr.text === filterBy.value)
      }),
      challengesCategory: computed(() => {
        if (!filterBy.value) {
          return AppState.challenges
        }
        return AppState.challenges.filter(c => c.category === filterBy.value)
      }),
      filterType(type) {
        if (type == 'newest'){
          AppState.challenges.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        } else if (type == 'oldest'){
          AppState.challenges.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        } else 
        AppState.challenges.filter(c => c.isCancelled == true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import url('../assets/scss/_variables.scss');
@import url('../assets/scss/_formStyles.scss');

.container-fluid {
  --bs-gutter-x: 0;
  overflow-x: hidden;
}

.create-challenge-card {
  // width: 100%;
  background-color: var(--bg-sub);
  border: 1px solid #2d386b;
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
  font-size: 1.5rem;
  height: 37px;
  padding-left: 1rem;
  &:not(:focus) {
    background-color: var(--bg-main);
    &::placeholder {
      color: var(--text-sub);
      font-size: 1.5rem;
    }
  }
}
.select-type {
  width: 100%;
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  border-radius: 0;
  color: var(--text-main);
  margin-top: 1rem;
  margin-right: 1rem;
}
h6 {
  color: var(--text-sub);
  font-size: 1.2rem;
  font-weight: 500;
}
.mobile-query {
  @media screen and (max-width: 768px) {
    height: 45px;
    margin-bottom: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>