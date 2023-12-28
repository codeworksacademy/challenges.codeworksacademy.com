<template>
  <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center my-3 text-light">Edit Challenge Details</h1>
        <section class="container-fluid text-light" v-if="challenge"> 
          <div>
            <div>
              <EditChallengeDetails :challenge="challenge"/>
            </div>
            <EditChallengeDescription :challenge="challenge"/>
          </div>
          <div>
            <EditChallengeRequirements :challenge="challenge"/>
          </div>
          <div>
          </div>
          <div class="text-center my-3">
            <button class="btn btn-success" @click="updateChallenge"> Update Challenge</button>
          </div>
        </section>
      </div>
  </div>
</template>
  
<script>
  import { computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { AppState } from '../AppState'
  import Pop from "../utils/Pop.js"
  import { logger } from "../utils/Logger.js"  
  import { challengesService } from '../services/ChallengesService'
  import EditChallengeDetails from '../components/EditChallenge/EditChallengeDetails.vue'
  import EditChallengeRequirements from '../components/EditChallenge/EditChallengeRequirements.vue'
  import EditChallengeDescription from '../components/EditChallenge/EditChallengeDescription.vue'

  export default {
    components: {
      EditChallengeDetails,
      EditChallengeRequirements,
      EditChallengeDescription
    },
    setup() {
      let route = useRoute()
      let router = useRouter()
      const challenge = computed(() => AppState.activeChallenge)

      async function setActiveChallenge() {
        try {
          await challengesService.setActiveChallenge(route.params.challengeId)
          logger.log(route.params.challengeId)
        } catch (error) {
          logger.error(error)
          Pop.toast(error, 'error')
        }
      }

      async function updateChallenge(){
        try {
          const updatedChallenge = {
            ...AppState.activeChallenge
          }
          await challengesService.updateChallenge(updatedChallenge, updatedChallenge.id)
          Pop.success("Challenge Updated")
          router.push({
            name: 'ChallengeDetails',
            path: `/challenges/${AppState.activeChallenge?.id}/overview`
          })
        } catch (e){
          logger.log(e)
          Pop.error(e)
        }
      }
  
      onMounted(() => {
        setActiveChallenge()
      })
      return {
        challenge,
        updateChallenge
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>