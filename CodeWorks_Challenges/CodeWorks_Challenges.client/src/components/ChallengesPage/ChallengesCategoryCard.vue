<template>
  <div class="accordion accordion-flush" id="accordionFlushExample">
    <div v-for="(category, index) in categoryTypes" :key="category" class="accordion-item">
      <div class="accordion-header">
        <button @click="isActive = !isActive" class="col-12 accordion-button collapsed text-white text-capitalize fw-semibold" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" :aria-expanded="isActive" :aria-controls="'collapse' + index" :aria-labelledby="'heading' + index">
          <div class="col-10">
            <span class="mdi me-3" :class="categoryIcons[category]"></span>
            {{ category }}
          </div>
          <div class="col-2 d-flex justify-content-end align-items center">
            <span class="badge mx-3 fw-normal" style="color: var(--text-sub); font-size: .9rem;"><b>{{ challengesByCategory(category).length }}</b> {{ category }} challenges</span>
            <span :class="['mdi fs-3', isActive ? 'mdi-chevron-up' : 'mdi-chevron-down']"></span>
          </div>
        </button>
      </div>
      <div :id="'collapse' + index" class="accordion-collapse collapse" :data-bs-parent="'#accordionFlushExample'">
        <div class="accordion-body py-2">
          <div class="d-flex flex-row align-items-center text-uppercase py-3">
            <div class="col-4 ps-4">
              <h6 class="ps-3">Challenge Name</h6>
            </div>
            <div class="col-2 pe-2">
              <h6 class="col-12 d-flex justify-content-center">Difficulty</h6>
            </div>
            <div class="col-5 d-flex justify-content-center align-items-center pe-1">
              <div class="col-3 d-flex justify-content-center">
                <h6 class="col-10">Rating</h6>
              </div>
              <div class="col-3 d-flex justify-content-center ps-2">
                <h6 class="col-9">Points</h6>
              </div>
              <div class="col-4 d-flex justify-content-center">
                <h6>User Solves</h6>
              </div>
            </div>
          </div>
          <div>
            <ChallengeCard v-for="c in challengesByCategory(category)" :key="c.id" :challenge="c" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
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

    function challengesByCategory(category) {
      return category ? AppState.challenges.filter(c => c.category === category) : AppState.challenges;
    };

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
.accordion-button, .accordion-button:not(.collapsed) {
  background: var(--bg-main);
}
.accordion-body {
  background: var(--bg-main);
    h6 {
      color: var(--text-sub);
      font-size: .8rem;
      font-weight: 500;
    }
}
</style>