<template>
    <section v-if="user.isAuthenticated" class="container-fluid">
      <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center text-light">
          <i class="mdi mdi-cog" style="font-size: 15rem; color: rgb(170, 170, 170);"></i>
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
        user: computed(() => AppState.user),
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>