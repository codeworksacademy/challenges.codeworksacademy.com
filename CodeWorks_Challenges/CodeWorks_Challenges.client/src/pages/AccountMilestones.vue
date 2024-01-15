<template>
  <div class="container-fluid">
    <section class="row my-3">
      <div class="col-12 text-white">
        <h5 class="text-center">
          <span>My Achievements</span>
        </h5>
      </div>
      <div class="col-12">
        <MilestonesTracker :milestones="milestones" />
      </div>
    </section>
  </div>
</template>

<script>
import { AppState } from '../AppState';
import MilestonesTracker from '../components/Milestones/MilestonesTracker.vue';

export default {
  setup() {
    return {
      milestones: AppState.milestones
    }
  },

  components: { MilestonesTracker }
}
</script>

<style scoped lang="scss"></style>