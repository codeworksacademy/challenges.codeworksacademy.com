<template>
    <section>
        <h1 v-if="user.isAuthenticated">You are authenticated {{ user.name }}</h1>
        <h1 v-else>You are not authenticated</h1>
    </section>
</template>
    
  <script>
  import { computed, onMounted, ref } from 'vue'
  import { AppState } from '../../AppState'
  import Pop from "../../utils/Pop.js"
  import { logger } from "../../utils/Logger.js"  
  import { Challenge } from "../../models/Challenge.js"
  import { challengesService } from "../../services/ChallengesService.js"
  import { useRouter } from 'vue-router';
  import { Modal } from "bootstrap"
  
  export default {
    props: {
      challenge: {
        type: Challenge || Object,
        required: false
      }
    },
    setup(props) {
  
      const editable = ref({
        name: '',
        description: ''
      })
  
      async function createChallenge() {
        
      }
  
      return {
        editable,
        createChallenge,
        user: computed(() => AppState.user)
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>