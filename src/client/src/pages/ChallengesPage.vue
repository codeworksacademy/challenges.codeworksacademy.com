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
        <div class="d-flex gap-3 align-items-center justify-content-between my-2">
          <span class="w-100 d-flex gap-2 align-items-center">
            <SelectChallengeDifficulty />
          </span>
          <span class="w-100">
            <SelectChallengeCategory />
          </span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 p-0">
        <router-view />
      </div>
    </div>
  </section>
</template>

<script>
import Pop from '../utils/Pop'
import { onMounted } from 'vue'
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

    async function getAllChallenges() {
      try { await challengesService.getAllChallenges(); }
      catch (error) { Pop.toast(error); }
    }

    onMounted(() => {
      getAllChallenges()
    })

    return {
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