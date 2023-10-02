<template>
  <div class="">
    <!-- Display the current instructional steps -->
    <div class="d-flex justify-content-center align-items-center">
      <ul>
        <li v-for="(step, index) in editableSteps" :key="index">
          {{ step }}
          <button @click="removeStep(index)" :title="`Remove ${step}?`" class="btn btn-outline-none mdi mdi-minus-circle-outline fs-3 border-0 outline-0 rounded-circle text-danger ms-0 ps-1"></button>
          <button @click="editStep(index)" :title="`Edit ${step}...`" class="btn btn-warning ms-1 p-1" style="opacity: .8; font-style: italic; font-weight: 450;">Edit?</button>
        </li>
      </ul>
    </div>

    <!-- Form for adding/editing instructional steps -->
    <form @submit.prevent="saveStep">
      <input v-model="newStep" class="text-light" type="text" placeholder="Enter challenge steps..." />
      <button
        :title="`Add ''${newStep}'' to challenge steps?`"
        type="submit"
        class="btn btn-outline-none text-light mdi mdi-plus-circle fs-3 mb-1"
      >
      </button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { AppState } from '../AppState.js';
import { challengesService } from '../services/ChallengesService.js';
import { logger } from "../utils/Logger.js";
import Pop from "../utils/Pop.js";
import { useRoute } from 'vue-router';


export default {

  setup() {
    const route = useRoute();

    const newStep = ref('');
    const editableIndex = ref(false);

    const editableSteps = computed(() => {
      return [...AppState.activeChallenge.steps];
    });


    async function updateChallenge() {
      try {
        const challengeId = AppState.activeChallenge.id;
        const newChallenge = {
          // Include any other fields you want to update
          steps: editableSteps.value,
        };

        await challengesService.updateChallenge(newChallenge, challengeId);
      } catch (error) {
        logger.error(error);
        Pop.toast(error.message, 'error');
      }
    }

    async function saveStep() {
      if (editableIndex.value === false) {
        AppState.activeChallenge.steps.push(newStep.value);
      } else {
        AppState.activeChallenge.steps[editableIndex.value] = newStep.value;
        editableIndex.value = false;
      }
      newStep.value = '';
      updateChallenge(); // Call the updateChallenge function to save changes
    }

    async function removeStep(index) {
      AppState.activeChallenge.steps.splice(index, 1);
      updateChallenge(); // Call the updateChallenge function to save changes
    }


    return {
      newStep,
      editableSteps,
      editableIndex,
      editStep(index) {
        editableIndex.value = index;
        newStep.value = AppState.activeChallenge.steps[index];
      },
      saveStep,
      removeStep,
      updateChallenge
    }
  },
}
</script>

<style scoped lang="scss">
input:not(:checked) {
  background: linear-gradient(90deg, #00000080, transparent);
  padding: .25 .5rem;
}
</style>