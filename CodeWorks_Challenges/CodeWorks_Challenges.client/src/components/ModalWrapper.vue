
<template>
  <div class="modal fade bg-transparent" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
      <div class="modal-content" style="overflow-y: auto;overflow-x: hidden;">
        <div class="col-12 d-flex position-relative mb-5">
          <button type="button" class="col-1 position-absolute top-1 left-1 close-btn mb-1" data-bs-dismiss="modal" aria-label="Close" aria-closed="true"><i title="Close" class="mdi mdi-close mdi-24px"></i></button>
        </div>
        <div class="modal-header" style="border: none;">
      <slot></slot>
        </div>
      </div>
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
export default {
  setup() {
    return {}
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/_variables.scss';


</style>