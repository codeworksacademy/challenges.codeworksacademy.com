<template>
  <div class="accordion accordion-flush" id="accordionFlushExample">
    <div v-for="category in categoryTypes" :key="category" class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed bg-dark text-white fs-4 text-capitalize fw-semibold" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+ category.id" aria-expanded="false" :aria-controls="'collapse' + category.id">
          {{ category }}
        </button>
      </h2>
      <div :id="'collapse' + category.id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
        <div class="accordion-body">
          <ChallengeCard v-for="c in challengesByCategory(category)" :challenge="c" />
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
  props: {
    challenge: {
      type: Challenge || Object,
      required: true,
    },
  },
  components: {
    ChallengeCard,
  },
  setup(props) {
    const filterBy = ref('');
    const challengeCategory = ref(Object.values(CATEGORY_TYPES))

    function challengesByCategory(category) {
      if (!category) {
        return AppState.challenges
      }
      return AppState.challenges.filter(c => c.category === category)
    }
    return {
      filterBy,
      challengeCategory,
      challengesByCategory,
      categoryTypes: computed(() => {
        const categories = AppState.challenges.map(c => c.category)
        return [...new Set(categories)]
      }),
      challenges: computed(() => AppState.challenges),



    };
  }
};
</script>

<style scoped lang="scss">
</style>