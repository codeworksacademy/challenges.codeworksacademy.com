
import ModerationCard from '../components/ModerationCard.vue';
<template>
  <div class="container-fluid">
    <section class="row text-white">
      <div class="col-3">
        Profile
      </div>
      <div class="col-3">
        Challenge
      </div>
      <div class="col-3">
        Status
      </div>
      <div class="col-3">
        Remove / Approve
      </div>
    </section>
    <section class="row">
      <ModerationCard :moderationProp="moderation in moderations" />
    </section>
  </div>
</template>


<script>
import { computed } from 'vue';
import { AppState } from '../AppState';

export default {
  setup(){
    return {
      moderations: computed(() => AppState.moderations)
    }
  }
}
</script>


<style lang="scss" scoped>

</style>