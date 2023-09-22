<template>
    <section v-if="challenge" :key="challenge?.id" class="container-fluid">
      <div class="modal-content">
        <button type="button" class="btn-close p-1 ms-1 mt-1" data-bs-dismiss="modal" aria-label="Close"></button>
        <div class="keep-header mb-4" style="border: none;">
          <h1 class="col-12 keep-title text-center" id="exampleModalLabel"> {{ challenge?.name }} </h1>
        </div>
        <div class="modal-body row d-flex pt-3">
          <p> {{ challenge?.description }} </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
        </div>
      </div>
    </section>
</template>
  
<script>
  import { computed, onMounted } from 'vue'
  import { AppState } from '../AppState'
  import Pop from "../utils/Pop.js"
  import { logger } from "../utils/Logger.js"  
  
  export default {
    components: {

    },
    setup() {

      onMounted(() => {

      })
      return {
        challenge: computed(() => AppState.activeChallenge ? AppState.activeChallenge : null)
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>