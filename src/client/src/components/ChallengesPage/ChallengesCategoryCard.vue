<template>
  <div class="accordion accordion-flush" id="category">
    <div class="accordion-body">
      <div class="d-none d-md-flex flex-row align-items-center text-uppercase pt-3">
        <div class="col-4 ps-4">
          <span class="ps-3">Challenge Name</span>
        </div>
        <div class="col-2 pe-2">
          <span class="col-12 d-flex justify-content-center">Difficulty</span>
        </div>
        <div class="col-5 d-flex justify-content-center align-items-center pe-1">
          <div class="col-3 d-flex justify-content-center">
            <span class="col-10">Reputation</span>
          </div>
          <div class="col-4 d-flex justify-content-center">
            <span>Solves</span>
          </div>
        </div>
      </div>
      <hr>
    </div>

    <div v-for="(category, index) in categoryTypes" :key="category">

      <div class="accordion-header" v-if="challengesByCategory(category).length">

        <button @click="isActive = !isActive"
          class="col-12 accordion-button collapsed text-white text-capitalize fw-semibold" type="button"
          data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" :aria-expanded="isActive"
          :aria-controls="'collapse' + index" :aria-labelledby="'heading' + index">
          <div class="col-10">
            <div class="d-flex  align-items-center">
              <i class="mdi fs-1 me-3" :class="categoryIcons[category]"></i>
              <p class="mb-0">
                {{ category }}
              </p>
            </div>
          </div>
          <div class="col-2 d-none d-lg-flex justify-content-end align-items center">
            <span class="badge mx-3 fw-normal" style="color: var(--text-sub); font-size: .9rem;"><b>
                {{ challengesByCategory(category).length }}</b>
              challenge{{ challengesByCategory(category).length > 1 ? 's' : '' }}
            </span>
            <span :class="['mdi fs-3', isActive ? 'mdi-chevron-up' : 'mdi-chevron-down']"></span>
          </div>
        </button>

      </div>

      <div :id="'collapse' + index" class="accordion-collapse collapse show" data-bs-parent="#category">
        <div class="accordion-body py-2">

          <div>
            <ChallengeCard v-for="c in challengesByCategory(category)" :key="c.id" :challenge="c" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { AppState } from '../../AppState';
import ChallengeCard from './ChallengeCard.vue';
import { CATEGORY_TYPES } from '../../constants';

export default {
  components: {
    ChallengeCard,
  },
  setup() {
    const isActive = ref(false);

    const categoryTypes = ref(Object.values(CATEGORY_TYPES));

    const categoryIcons = ref({
      'full stack': 'mdi-layers-outline',
      'front end': 'mdi-monitor-cellphone-star',
      'back end': 'mdi-server-plus-outline',
      'data structures': 'mdi-file-tree-outline',
      'style and design': 'mdi-palette-outline',
      'puzzles': 'mdi-puzzle-outline',
      'other': 'mdi-asterisk',
    });

    const difficultySort = ref(AppState.enableDifficultySorting)

    watch(() => AppState.enableDifficultySorting, () => {
      difficultySort.value = AppState.enableDifficultySorting;
    })

    function challengesByCategory(category) {
      if (difficultySort.value) {
        return category
          ? AppState.challenges
            .filter(c => c.category === category)
            .sort((a, b) => a.difficulty - b.difficulty)
          : [...AppState.challenges]
            .sort((a, b) => a.difficulty - b.difficulty)
      }
      return (AppState.challenges.filter(c => c.category === category))
    }

    // return category ? AppState.challenges.filter(c => c.category === category) : AppState.challenges;


    return {
      isActive,
      categoryIcons,
      categoryTypes,
      challengesByCategory,
    };
  }
};
</script>

<style scoped lang="scss">
.accordion-button,
.accordion-button:not(.collapsed) {
  background: var(--bg-main);
}

.accordion-body {
  background: var(--bg-main);

  span {
    color: var(--text-sub);
    font-size: .8rem;
    font-weight: 500;
  }
}

.accordion-button::after {
  content: unset
}
</style>