<template>
  <!-- <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#moderatorsOffcanvas" aria-controls="offcanvasBottom">Toggle bottom offcanvas</button> -->

  <div class="offcanvas offcanvas-bottom bg-dark" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
    <div class="offcanvas-header">
      <!-- <h5 class="offcanvas-title" id="offcanvasBottomLabel">Offcanvas bottom</h5> -->
      <slot name="header"></slot>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body small">
      <slot name="body"></slot>
    </div>
  </div>
</template>