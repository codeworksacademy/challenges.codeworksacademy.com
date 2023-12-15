<template>
    <section class="container-fluid mb-3">
      <div class="form-floating">
        <textarea v-model="challenge.description" class="form-control" placeholder="Challenge Description" id="challengeDescriptionTextArea" style="height: 300px"></textarea>
      </div>
    </section>
</template>
  
<script>
  import { computed, onMounted } from 'vue'
  import Pop from "../../utils/Pop.js"
  import { logger } from "../../utils/Logger.js"  
  import {Challenge} from '../../models/Challenge'
  
  export default {
    props: {
      challenge: {
        type: Challenge || Object,
        required: true
      }
    },
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
