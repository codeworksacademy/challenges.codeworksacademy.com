<template>
  <div class="container-fluid">
    <section class="row my-3">
      <div class="col-12 text-white">
        <h5 class="text-center">
          <span>My Milestones</span>
        </h5>
      </div>
      <div class="col-12">
        <MilestonesTracker />
      </div>
    </section>
  </div>
</template>

<script>
import MilestonesTracker from '../components/Milestones/MilestonesTracker.vue';

export default {
  components: { MilestonesTracker },

  setup() {
    return {
    }
  }
}
</script>

<style scoped lang="scss"></style>