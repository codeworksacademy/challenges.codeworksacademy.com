<template>
  <section class="container-fluid text-light" v-if="challenge"> 
      //STUB - V-if Challenge
      <h1>Refactor</h1>
      <div>
        //STUB Challenge Name and Description component
        <div> //STUB Component for these five things
          //TODO - Add Details Functionality
          <EditChallengeDetails :challenge="challenge"/>
          //FIXME - Challenge Name
          //FIXME - Challenge Cover Image
          //FIXME - Challenge Category
          //FIXME - Challenge Difficulty
          //FIXME - Challenge AutoGrade? Challenge Answer?
        </div>
        //TODO Component - Challenge Description Editing (Markdown if usable)
      </div>
      <div>
        <EditChallengeRequirements :challenge="challenge"/>
        //TODO Challenge Requirements Component
      </div>
      <div>
        //TODO Challenge Status - What should the owner be allowed to do? What should moderators be able to do?
      </div>
      <div>
        //TODO Update Challenge? Validate the changes made to the challenge?
      </div>
      <!-- {{ challenge }} -->
    </section>
</template>
  
<script>
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { AppState } from '../AppState'
  import Pop from "../utils/Pop.js"
  import { logger } from "../utils/Logger.js"  
  import { challengesService } from '../services/ChallengesService'
  import EditChallengeDetails from '../components/EditChallenge/EditChallengeDetails.vue'
  import EditChallengeRequirements from '../components/EditChallenge/EditChallengeRequirements.vue'
  
  export default {
    components: {
      EditChallengeDetails,
      EditChallengeRequirements
    },
    setup() {
      let route = useRoute()

      async function setActiveChallenge() {
        try {
          await challengesService.setActiveChallenge(route.params.challengeId)
          logger.log(route.params.challengeId)
        } catch (error) {
          logger.error(error)
          Pop.toast(error, 'error')
        }
      }
  
      const challenge = computed(() => AppState.activeChallenge)
      onMounted(() => {
        setActiveChallenge()
      })
      return {
        challenge
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>