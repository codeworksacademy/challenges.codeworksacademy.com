<template>
  <div class="accordion accordion-flush" id="accordionFlushExample">
    <div v-for="(category, index) in categoryTypes" :key="category" class="accordion-item">
      <h2 class="accordion-header">
        <button @click="isActive = !isActive" class="col-12 accordion-button collapsed bg-dark text-white fs-5 text-capitalize fw-semibold" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" :aria-expanded="isActive" :aria-controls="'collapse' + index" :aria-labelledby="'heading' + index">
          <div class="col-10">
            <span class="mdi me-3" :class="categoryIcons[category]"></span>
            {{ category }}
          </div>
          <div class="col-2 d-flex justify-content-end align-items center">
            <span class="badge mx-3 fw-normal" style="color: var(--text-sub); font-size: .8rem;">{{ challengesByCategory(category).length }} {{ category }} challenges</span>
            <span :class="['mdi', isActive ? 'mdi-chevron-right' : 'mdi-chevron-down']"></span>
          </div>
        </button>
      </h2>
      <div :id="'collapse' + index" class="accordion-collapse collapse" :data-bs-parent="'#accordionFlushExample'">
        <div class="accordion-body p-0" style="background: var(--bg-main);">
          <ChallengeCard v-for="c in challengesByCategory(category)" :key="c.id" :challenge="c" />
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
import { logger } from "../../utils/Logger.js";

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true,
    },
  },
  components: {
    ChallengeCard,
  },
  setup() {
    const categoryIcons = ref({
      'full stack': 'mdi-layers-outline',
      'front end': 'mdi-monitor-cellphone-star',
      'back end': 'mdi-server-plus-outline',
      'data structures': 'mdi-file-tree-outline',
      'style and design': 'mdi-palette-outline',
      'puzzles': 'mdi-puzzle-outline',
      'other': 'mdi-asterisk',
    });

    const isActive = ref(false);

    function challengesByCategory(category) {
      return category ? AppState.challenges.filter(c => c.category === category) : AppState.challenges;
    }

    return {
      isActive,
      categoryIcons,
      challengesByCategory,
      categoryTypes: computed(() => {
        let categories = AppState.challenges.filter(c => c.category).map(c => c.category);
        categories = [...new Set(categories)];
        return categories;
      }),
    };
  }
};
</script>

<style scoped lang="scss">
</style>