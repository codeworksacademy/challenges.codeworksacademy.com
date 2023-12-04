<template>
    <section class="container-fluid">
      <div class="rounded">
        <h1>Challenge</h1>
        <p class="bg-light rounded">{{ challenge }}</p>
      </div>
      <div class="rounded">
        <h1>Account</h1>
        <p class="bg-light rounded">{{ account }}</p>
      </div>
      <div class="rounded">
        <h1>User</h1>
        <p class="bg-light rounded">{{ user }}</p>
      </div>
      <div class="row" v-if="challenge && challenge.creatorId == account.id">
        <h1>Owned Section</h1>
        <div class="d-flex">
          <button class="btn btn-success">Edit Challenge</button>
        </div>
      </div>
      <div class="row">
        <div class="d-flex">
          <button class="btn btn-success" @click="joinChallenge()">Join Challenge</button>
        </div>
      </div>
    </section>
</template>
  
<script>
  import { computed, onMounted } from 'vue'
  import { AppState } from '../AppState'
  import Pop from "../utils/Pop.js"
  import { logger } from "../utils/Logger.js"  
  import { useRouter, useRoute } from 'vue-router'
  import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'
  
  export default {
    components: {

    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const account = computed(()=> AppState.account)
        //If a participant is found, return the participant, otherwise return false
        const participant = computed(() => {
          const foundParticipant = AppState.participants.find(p => p.accountId == AppState.account.id)
          return foundParticipant ? foundParticipant : false;
        })
        async function setActiveChallenge(){
          try {
            const challengeId = route.params.challengeId
            await challengesService.setActiveChallenge(challengeId)
          } catch (error) {
            logger.error(error)
            Pop.toast(error, 'error')
          }
        }

        //Actions - Owner / Moderator
        //SECTION - Participant
        //SECTION - Not Participant
        async function joinChallenge(){
          try {
            if(Object.keys(account.value).length === 0){
              Pop.error("You must be logged in to join a challenge!")
            } else {
              const confirm = await Pop.confirm("Would you like to join this challenge?")
              if(!confirm){
                return
              }
              const newParticipant = {
                challengeId: route.params.challengeId,
                accountId: AppState.user.id,
                status: 'started',
                supportLinks: [
                  {
                    name: '',
                    url: ''
                  }
                ],
              }
              await participantsService.joinChallenge(newParticipant)
              Pop.success(`You have successfully joined ${AppState.activeChallenge.name}`)
            }
          } catch (error) {
            logger.error(error)
            Pop.toast(error)
          }
        }
      onMounted(() => {
        setActiveChallenge()
      })
      return {
        // account: computed(() => AppState.account),
        account,
        participant,
        user: computed(() => AppState.user),
        challenge: computed(() => AppState.activeChallenge),
        joinChallenge
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>