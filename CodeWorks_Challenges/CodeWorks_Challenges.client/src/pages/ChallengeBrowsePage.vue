<template>
  <div class="row d-flex justify-content-center align-items-center" style="width: 100%;">
    <ChallengeCategoryCard :categoryTypes="categoryTypes" />
  </div>
</template>

<script>
import ChallengeCategoryCard from '../components/ChallengesPage/ChallengeCategoryCard.vue';
import { ref } from 'vue';
import { CATEGORY_TYPES } from "../constants/index.js";

export default {
  components: {
    ChallengeCategoryCard,
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

    return {
      isActive,
      categoryIcons,
      categoryTypes,
    };
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/variables.scss";
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