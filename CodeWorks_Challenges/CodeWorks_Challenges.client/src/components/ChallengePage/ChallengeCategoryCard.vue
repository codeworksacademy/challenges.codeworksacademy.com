<template>
  <div class="accordion accordion-flush" id="accordionFlushExample">
    <div v-for="(category, index) in categoryTypes" :key="category" class="accordion-item">
      <h2 class="accordion-header">
        <button @click="isActive = !isActive" class="col-12 accordion-button collapsed text-white text-capitalize fw-semibold" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" :aria-expanded="isActive" :aria-controls="'collapse' + index" :aria-labelledby="'heading' + index">
          <div class="col-10">
            <span class="mdi me-3" :class="categoryIcons[category]"></span>
            {{ category }}
          </div>
          <div class="col-2 d-flex justify-content-end align-items center">
            <span class="badge mx-3 fw-normal" style="color: var(--text-sub); font-size: .8rem;"><b>{{ challengesByCategory(category).length }}</b> {{ category }} challenges</span>
            <span :class="['mdi', isActive ? 'mdi-chevron-right' : 'mdi-chevron-down']"></span>
          </div>
        </button>
      </h2>
      <div :id="'collapse' + index" class="accordion-collapse collapse" :data-bs-parent="'#accordionFlushExample'">
        <div class="accordion-body py-2">
          <div class="col-12 challenge-keys d-flex justify-content-around align-items-center text-uppercase py-3">
            <div class="col-4 d-flex ps-3">
              <h6 class="ms-4">Challenge Name</h6>
            </div>
            <div class="col-2 d-flex justify-content-around pe-2">
              <h6>Difficulty</h6>
            </div>
            <div class="col-5 d-flex m-auto">
              <div class="col-4">
                <h6>Rating</h6>
              </div>
              <div class="col-4 px-2">
                <h6>Points</h6>
              </div>
              <div class="col-4 px-2">
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
import ChallengeCard from '../ChallengeCard.vue';
import { Challenge } from '../../models/Challenge';
import { computed, ref } from 'vue';
import { AppState } from '../../AppState';
import { CATEGORY_TYPES } from "../../constants/index.js";

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
@import "../../assets/scss/variables.scss";
.accordion-button, .accordion-button:not(.collapsed) {
  background: var(--bg-main)
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