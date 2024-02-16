<template>
  <section class="container-fluid px-2 px-lg-5 pt-2 pt-lg-5">
    <div class="row">
      <div class="col-12 mb-2 mb-lg-3">
        <div class="create-challenge-card d-block d-md-flex align-items-end px-1 pb-1 p-md-2 p-lg-3">
          <span>
            <sub class="ms-3 text-uppercase">Gain Reputation</sub>
            <div class="ms-1 mt-1">
              <button type="button" role="button" class="btn text-warning selectable" title="Create a new challenge"
                data-bs-toggle="collapse" data-bs-target="#createChallenge" aria-expanded="false"
                aria-controls="createChallenge">
                Create a Challenge
              </button>
            </div>
          </span>
          <span class="w-75">
            <div class="collapse pt-2 pt-md-0" id="createChallenge">
              <CreateChallengeForm />
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="d-flex gap-3 align-items-center justify-content-between">
          <SelectChallengeDifficulty :filterBy="challengesDifficulty" />
          <SelectChallengeCategory :filterBy="challengesCategory" />
        </div>
      </div>
    </div>
    <div class="row">
      <router-view />
    </div>
  </section>
</template>

<script>
import Pop from '../utils/Pop'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { computed, onMounted, ref } from 'vue'
import { challengesService } from '../services/ChallengesService'
import SelectChallengeDifficulty from '../components/ChallengesPage/SelectChallengeDifficulty.vue'
import SelectChallengeCategory from "../components/ChallengesPage/SelectChallengeCategory.vue"
import CreateChallengeForm from "../components/Forms/CreateChallengeForm.vue"

export default {
  components: {
    SelectChallengeDifficulty,
    SelectChallengeCategory,
    CreateChallengeForm
  },
  setup() {
    const search = ref({})
    const filterBy = ref('')
    const showCreate = ref(false)

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
      showCreate,
      user: computed(() => AppState.user),
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
        if (type == 'newest') {
          AppState.challenges.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        } else if (type == 'oldest') {
          AppState.challenges.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        } else
          AppState.challenges.filter(c => c.isCancelled == true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
  transition: all .3s ease;
}

h6 {
  color: var(--text-sub);
  font-size: 1.2rem;
  font-weight: 500;
}
</style>