
<template>
  <div class="modal fade bg-transparent" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
      <div class="modal-content" style="overflow-y: auto;overflow-x: hidden;">
        <div class="col-12 d-flex position-relative mb-5">
          <button type="button" class="col-1 position-absolute top-1 left-1 close-btn mb-1" data-bs-dismiss="modal" aria-label="Close" aria-closed="true"><i title="Close" class="mdi mdi-close mdi-24px"></i></button>
        </div>
        <div class="modal-header" style="border: none;">
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>
      </div>
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