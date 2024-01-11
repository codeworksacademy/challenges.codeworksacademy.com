<template>
  <div class="creator-details-card p-2">
    <div class="col-4 d-flex flex-column justify-content-evenly align-items-center">
      <router-link :to="{ name: 'Profile.overview', params: { profileId: challenge.creator.id } }">
        <img :src="challenge.creator.picture" :alt="`Image for Challenge creator named '${challenge.creator.name}' is broken`" :title="`Image of the Challenge Creator; ${challenge.creator.name}`" class="img-fluid rounded-circle me-2" style="height: 75px;width:75px">
      </router-link>
      <h5 class="text-uppercase pe-2">Creator</h5>
    </div>
    <div class="col-8 d-flex flex-column justify-content-evenly">
      <h3 :style="isMobile ? 'padding-left: 4rem;' : 'padding-left: 1.5rem;'" class="col-12 creator-text d-flex justify-content-center offset-1 text-capitalize"> {{ challenge.creator.name }} </h3>
      <div class="col-12 button-container d-flex justify-content-center offset-2 mt-2">
        <button @click="giveReputation" class="btn bg-dark btn-success text-success me-3"><small>Give Reputation</small></button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import Pop from '../../utils/Pop'
import { useRoute } from 'vue-router'
import { AppState } from '../../AppState'
import { Challenge } from '../../models/Challenge'
import { challengesService } from '../../services/ChallengesService'

export default {
  props: {
    challenge: {
      type: Challenge|| Object,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const isMobile = computed(() => window.innerWidth < 768)

    const isParticipant = computed(() => {
      const participant = AppState.ChallengeState.participants.find(p => p.accountId === AppState.AccountState.account.id)
      return participant
    })

    const gaveReputation = computed(() => {
      const challenge = props.challenge
      if(challenge.reputationIds.find(r => r == AppState.AccountState.account.id)){
        return true
      }
      return false
    })

    async function giveReputation(){
        try {
          await challengesService.giveReputation(route.params.challengeId)
        } catch (error) {
          Pop.error(error.message)
        }
      }

    return {
      route,
      isMobile,
      isParticipant,
      gaveReputation,
      giveReputation
    }
  }
}
</script>