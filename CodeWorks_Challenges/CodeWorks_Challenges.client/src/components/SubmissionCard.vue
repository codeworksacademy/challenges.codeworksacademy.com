<template>
    <section class="container-fluid">
        <div class="row">
        <div class="col-md-6">
            <div class="d-flex gap-1">
                <p>Participant Name</p>
                <p>Repo</p>
                <p>Submit Date</p>
                <p>Submit Status</p>
            </div>
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

      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>