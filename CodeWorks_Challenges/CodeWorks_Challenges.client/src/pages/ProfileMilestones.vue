<template>
  <section class="container-fluid">
    <div v-for="milestone in milestones" :key="milestone.id" class="col-12">
      <MilestoneCard v-if="milestone.claimed && !milestone.description" :milestone="milestone" />
    </div>
  </section>
</template>

<script>
import { computed } from 'vue';
import { AppState } from '../AppState';
import MilestoneCard from '../components/Milestones/MilestoneCard.vue';


export default {
  setup() {


    return {
      milestones: computed(() => AppState.AccountState.milestones),
    };
  },
  components: { MilestoneCard, }
}
</script>


<style lang="scss" scoped></style>