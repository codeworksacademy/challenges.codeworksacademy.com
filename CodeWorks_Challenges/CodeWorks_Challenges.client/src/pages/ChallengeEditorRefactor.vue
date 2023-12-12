<template>
  <div class="row">
      <div class="col-md-6">
        <section class="container-fluid text-light" v-if="challenge"> 
          <!-- //STUB - V-if Challenge -->
          <h2 class="text-warning text-center">Refactor In Progress</h2>
          <div>
            <!-- //STUB Challenge Name and Description component -->
            <div>
              <!-- //TODO - Add Details Functionality -->
              <EditChallengeDetails :challenge="challenge"/>
              <!-- //FIXME - Challenge Name -->
              <!-- //FIXME - Challenge Cover Image -->
              <!-- //FIXME - Challenge Category -->
              <!-- //FIXME - Challenge Difficulty -->
              <!-- //FIXME - Challenge AutoGrade? Challenge Answer? -->
            </div>
            <EditChallengeDescription :challenge="challenge"/>
            <!-- //TODO Component - Challenge Description Editing (Markdown if usable) -->
          </div>
          <div>
            <EditChallengeRequirements :challenge="challenge"/>
            <!-- //TODO Challenge Requirements Component -->
          </div>
          <div>
            <!-- //TODO Challenge Status - What should the owner be allowed to do? What should moderators be able to do? -->
          </div>
          <div class="text-center my-3">
            <!-- //TODO Update Challenge? Validate the changes made to the challenge? -->
            <button class="btn btn-success" @click="updateChallenge"> Update Challenge</button>
          </div>
        </section>
      </div>
      <div class="col-md-6 text-light">
        <p v-for="(value, key) in challenge">{{ key }}: {{ value }}</p>
      </div>
  </div>
  <!-- <section class="container-fluid text-light" v-if="challenge"> 
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
        <EditChallengeDescription :challenge="challenge"/>
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
        <button class="btn btn-success"> Update Challenge</button>
      </div>
    </section> -->
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
  import EditChallengeDescription from '../components/EditChallenge/EditChallengeDescription.vue'

  export default {
    components: {
      EditChallengeDetails,
      EditChallengeRequirements,
      EditChallengeDescription
    },
    setup() {
      let route = useRoute()
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