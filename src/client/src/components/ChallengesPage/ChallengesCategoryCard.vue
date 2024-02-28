<template>
  <div class="accordion-header" v-if="filterByCategory().length">
    <button @click="isActive = !isActive" class="accordion-button collapsed text-primary text-capitalize fw-semibold"
      type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" :aria-expanded="isActive"
      :aria-controls="'collapse' + index" :aria-labelledby="'heading' + index">
      <div class="col-10">
        <div class="d-flex align-items-center">
          <i class="mdi fs-1 me-3" :class="categoryIcons[category]"></i>
          <p class="mb-0">
            {{ category }}
          </p>
        </div>
      </div>
      <div class="col-2 d-none d-lg-flex justify-content-end align-items-center">
        <span class="badge mx-3 fw-normal" style="color: var(--text-sub); font-size: .9rem;">
          <b>{{ filterByCategory().length }}</b>
          challenge{{ filterByCategory().length > 1 || filterByCategory().length == 0 ? 's' : '' }}
        </span>
        <span :class="['mdi fs-3', isActive ? 'mdi-chevron-up' : 'mdi-chevron-down']"></span>
      </div>
    </button>
  </div>

  <div :id="'collapse' + index" class="accordion-collapse collapse show" data-bs-parent="#category">
    <div class="accordion-body py-2">
      <div v-for="challenge in filterByCategory()" :key="challenge.id">
        <ChallengeCard :challenge="challenge" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from "vue-router";
import { AppState } from '../../AppState';
import ChallengeCard from './ChallengeCard.vue';

export default {
  components: { ChallengeCard, },
  props: {
    category: { type: String },
    index: { type: Number }
  },
  setup(props) {
    const route = useRoute();

    const difficultySort = ref(AppState.enableDifficultySorting);
    const difficultyTypes = ref(['easy', 'medium', 'hard']);
    const difficultyFilter = ref(route.params.difficulty);
    const categoryChallenges = ref(filterByCategory());

    watch(() => AppState.enableDifficultySorting, () => {
      difficultySort.value = AppState.enableDifficultySorting;
    })
    watch(() => route.params.difficulty, () => {
      categoryChallenges.value = filterByCategory();
    })

    const isActive = ref(false);
    const categoryIcons = ref({
      'full stack': 'mdi-layers-outline',
      'front end': 'mdi-monitor-cellphone-star',
      'back end': 'mdi-server-plus-outline',
      'data structures': 'mdi-file-tree-outline',
      'style and design': 'mdi-palette-outline',
      'puzzles': 'mdi-puzzle-outline',
      'other': 'mdi-asterisk',
    });

    function filterByCategory() {
      const challenges = [...AppState.challenges]
        .filter(c => c.category === props.category);

      if ((!difficultyFilter.value || difficultyFilter.value == 'all') && difficultySort.value) {
        return challenges.sort((a, b) => a.difficulty - b.difficulty);
      }
      if (!difficultyFilter.value || difficultyFilter.value == 'all') {
        return challenges;
      }
      return challenges.filter(d => d.difficulty == (difficultyTypes.value.findIndex(d => d == difficultyFilter.value) + 1))
    };

    return {
      isActive,
      categoryIcons,
      difficultySort,
      difficultyFilter,
      difficultyTypes,
      categoryChallenges,
      filterByCategory,

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