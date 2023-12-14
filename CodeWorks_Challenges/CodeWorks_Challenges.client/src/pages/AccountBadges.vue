<template>
  <div class="container-fluid">
    <section class="row my-3">
      <div class="col-12 text-white">
        <h5>
          Waiting for Badges to be implemented.
        </h5>
      </div>
      <div class="col-12">
        <MilestonesTracker />
      </div>
    </section>
  </div>
</template>

<script>
import MilestonesTracker from '../components/MilestonesTracker.vue';


export default {
    setup() {
        return {};
    },
    components: { MilestonesTracker }
}
</script>

<style scoped lang="scss">

</style>