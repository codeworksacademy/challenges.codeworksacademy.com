<template>
  <section
    v-if="isModeratorStatus == 'approved' || challengeCreator"
    class="container-fluid"
  >
  </section>
</template>
  
<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  

export default {
  components: {

  },
  setup() {
    //[log] :: 5:19:32 PM ::  New participant: {challengeId: '652c7a161614f802d07f369d', accountId: '65074e3517cf6850c20fb9be', _id: '6542dd03dbfc83ca250c9c65', createdAt: '2023-11-01T23:19:31.850Z', updatedAt: '2023-11-01T23:19:31.850Z', …}accountId: "65074e3517cf6850c20fb9be"challenge: {badges: Array(0), valid: false, _id: '652c7a161614f802d07f369d', creatorId: '652afb3b2b05514feeebc6be', name: 'Evil Challenge II', …}answers: []badges: []coverImg: "https://i.ibb.co/c21hFZN/card-gradient.png"createdAt: "2023-10-15T23:47:34.038Z"creator: {_id: '652afb3b2b05514feeebc6be', subs: Array(1), email: 'evilkyle@evil.kyle', name: 'evilkyle', picture: 'https://s.gravatar.com/avatar/dbe59226b94db5327fad…&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fev.png', …}creatorId: "652afb3b2b05514feeebc6be"description: "An even more evil test of evilness"difficulty: 1id: "652c7a161614f802d07f369d"isCancelled: falsename: "Evil Challenge II"participantCount: 2pointValue: 1steps: []supportLinks: []updatedAt: "2023-10-15T23:47:34.038Z"valid: false__v: 0_id: "652c7a161614f802d07f369d"[[Prototype]]: ObjectchallengeId: "652c7a161614f802d07f369d"createdAt: "2023-11-01T23:19:31.850Z"id: "6542dd03dbfc83ca250c9c65"profile: {_id: '65074e3517cf6850c20fb9be', name: 'AJ Vancattenburch', picture: 'https://i.ibb.co/BspKQm6/avc-logo.png', id: '65074e3517cf6850c20fb9be'}updatedAt: "2023-11-01T23:19:31.850Z"__v: 0_id: "6542dd03dbfc83ca250c9c65"[[Prototype]]: Object

    //Judging by the data above, could we tap into an individual challenge that a participant is in? And generate whether or not they have submitted that challenge with some frontend logicusing dot notation e.g. participant.challenge.

    function isModeratorStatus() {
      const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }
    onMounted(() => {
      isModeratorStatus() 
    })
    return {
      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      challengeCreator: computed(() => AppState.user.id === AppState.activeChallenge?.creatorId),
      isModeratorStatus,
      isParticipant: computed(() => AppState.activeChallenge.participants.find(p => p.accountId == AppState.account.id)),

    } 
  }
}
</script>

<style scoped lang="scss">

</style>