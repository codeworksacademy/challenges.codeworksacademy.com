
import SubmitChallengeButton from './SubmitChallengeButton.vue';
<template>

  <div class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">

      <slot></slot>

        <!-- <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ...
        </div> -->
        <!-- <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div> -->
    </div>
  </div>



</template>

<script>
// import SubmitChallengeButton from './SubmitChallengeButton.vue';
export default {
  // components: { SubmitChallengeButton },
  setup() {
    return {}
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/_variables.scss';


</style>