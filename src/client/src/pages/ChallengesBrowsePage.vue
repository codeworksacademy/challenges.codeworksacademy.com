<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center align-items-center ps-3 w-100">
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
        <span v-if="!resetMe">
          <div v-for="(category, index) in categoryTypes" :key="category">
            <ChallengesCategoryCard :category="category" :index="index" />
          </div>
        </span>

      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import ChallengesCategoryCard from '../components/ChallengesPage/ChallengesCategoryCard.vue';
import { CATEGORY_TYPES } from '../constants';
import { ref, watch } from "vue";

export default {
  components: { ChallengesCategoryCard },

  setup() {
    const route = useRoute();
    const resetMe = ref(false);
    const categoryTypes = ref(Object.values(CATEGORY_TYPES));
    watch(() => route.params.difficulty, () => {
      resetMe.value = true;
      setTimeout(() => {
        resetMe.value = false;
      }, 1);
    })
    return {
      resetMe,
      categoryTypes,
    };
  }
};
</script>

<style scoped lang="scss">
.accordion-body {
  background: var(--bg-main);

  span {
    color: var(--text-sub);
    font-size: .8rem;
    font-weight: 500;
  }
}
</style>