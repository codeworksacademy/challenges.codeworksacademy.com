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

export default {

  props: {
    steps: Array, 
  },

  setup(props) {
    const newStep = ref('');
    const editableIndex = ref(false);

    const editableSteps = computed(() => {
      return [...props.steps];
    });

    async function editStep(index) {
      newStep.value = editableSteps.value[index];
      editableIndex.value = index;
    }

    async function saveStep() {
      if (editableIndex.value === false) {
        editableSteps.value.push(newStep.value);
      } else {
        editableSteps.value[editableIndex.value] = newStep.value;
        editableIndex.value = false;
      }
      newStep.value = '';
    }

    async function removeStep(index) {
      editableSteps.value.splice(index, 1);
    }

    return {
      newStep,
      editableSteps,
      editStep,
      saveStep,
      removeStep,
    };
  },
};
</script>

<style scoped lang="scss">
input:not(:checked) {
  background: linear-gradient(90deg, #00000080, transparent);
  padding: .25 .5rem;
}
</style>