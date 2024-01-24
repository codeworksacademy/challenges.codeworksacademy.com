<template>
  <div :class="`creator-details-card ${themeStyle ? 'theme-style' : ''} rounded text-capitalize p-2`"
    :style="{ backgroundColor: bgColor, borderColor: color, borderStyle: 'groove' }">
    <div class="col-4 d-flex flex-column justify-content-evenly align-items-center">
      <router-link :to="{ name: 'Profile.overview', params: { profileId: challenge.creator.id } }">
        <img :src="challenge.creator.picture"
          :alt="`Image for Challenge creator named '${challenge.creator.name}' is broken`"
          :title="`Image of the Challenge Creator; ${challenge.creator.name}`" class="img-fluid rounded-circle me-2"
          style="height: 75px;width:75px">
      </router-link>
      <h5 class="text-uppercase pe-2">Creator</h5>
    </div>
    <div class="col-8 d-flex flex-column justify-content-evenly">
      <h3 :style="isMobile ? 'padding-left: 4rem;' : 'padding-left: 1.5rem;'"
        class="col-12 creator-text d-flex justify-content-center offset-1 text-capitalize"> {{ challenge.creator.name }}
      </h3>
      <div class="col-12 button-container d-flex justify-content-center offset-2 mt-2">
        <button v-if="isParticipant && !gaveReputation" @click="giveReputation" class="btn bg-dark btn-success text-success me-3"><small>Give Reputation</small></button>
        <button v-if="isParticipant && gaveReputation" @click="giveReputation" class="btn bg-dark btn-danger text-danger me-3"><small>Remove Reputation</small></button>
        <div v-if="!isParticipant && !isCreator" class="disabled-title" :title="`You must be a participant of '${challenge.name}' before you can award it's creator with reputation.`">
          <button class="btn bg-dark btn-warning text-light me-3" disabled><small>Give Reputation</small></button>
        </div>
        <div v-if="isCreator" class="disabled-title" :title="`${challenge.creator.name}'s total Reputation: ${challenge.creator.reputation}`">
          <button class="btn bg-info btn-warning text-white me-3" disabled><small>View Reputation</small></button>
        </div>
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
      type: Challenge || Object,
      required: true
    },
    bgColor: { type: String, required: true },
    color: { type: String, required: true },
    themeStyle: { type: Boolean, required: true, default: false }
  },
  setup(props) {
    const route = useRoute()
    const isMobile = computed(() => window.innerWidth < 768)

    const isParticipant = computed(() => {
      const participant = AppState.ChallengeState.participants.find(p => p.accountId === AppState.AccountState.account.id)
      return participant
    })

    const isCreator = computed(() => {
      if (AppState.AccountState.account.id === props.challenge.creator.id) {
        return true
      }
      return false
    })

    const gaveReputation = computed(() => {
      const challenge = props.challenge
      if (challenge.reputationIds.find(r => r == AppState.AccountState.account.id)) {
        return true
      }
      return false
    })

    async function giveReputation() {
      try {
        const challengeId = props.challenge.id
        const accountId = AppState.AccountState.account?.id
        await challengesService.giveReputation(challengeId, accountId)
        if (gaveReputation.value) {
          Pop.toast(`The CodeWorks team and ${props.challenge.creator.name} appreciate you gifting +1 Reputation to challenge '${props.challenge.name}'!`, 'success')
        } else {
          Pop.toast(`You have removed your reputation point to ${props.challenge.creator.name} for '${props.challenge.name}.'`, 'success')
        }
      } catch (error) {
        Pop.error(error.message)
      }
    }

    return {
      route,
      isMobile,
      isCreator,
      isParticipant,
      gaveReputation,
      giveReputation,
      canGiveReputation: computed(() => {
        if (props.challenge.reputationIds.find(r => r == AppState.AccountState.account.id)) {
          return false
        }
        return true
      })
    }
  }
}
</script>