<template>
  <div :class="`details-card d-flex justify-content-center align-items-center ${themeStyle ? 'theme-style' : ''} rounded text-capitalize pt-3`" :style="{backgroundColor: bgColor, borderColor: color, borderStyle: 'groove'}">
    <div class="col-12 button-container d-flex justify-content-center align-items-center">
      <button v-if="isParticipant && !gaveReputation" @click="giveReputation" class="btn bg-dark btn-success text-success me-3"><small>Give Reputation</small></button>
      <button v-if="isParticipant && gaveReputation" @click="giveReputation" class="btn bg-dark btn-danger text-danger me-3"><small>Remove Reputation</small></button>
      <div v-if="!isParticipant && !isCreator" class="disabled-title" :title="`You must be a participant of '${challenge.name}' before you can award it's creator with reputation.`">
        <button class="btn bg-dark btn-warning text-light me-3" disabled><small>Give Reputation</small></button>
      </div>
      <div v-if="isCreator" class="disabled-title" :title="`${challenge.creator.name}'s total Reputation: ${challenge.creator.reputation}`">
        <button class="btn bg-info btn-warning text-white me-3" disabled><small>View Reputation</small></button>
      </div>
    </div>
    <i class="mdi mdi-account-star-outline"></i>
    <h3 class="circle-container"><span class="circle">+{{ challenge.reputationIds.length }}</span></h3>
    <div class="d-flex flex-column justify-content-center align-items-center text-uppercase pb-5 pt-3">
      <h3 class="text-capitalize">Reputation</h3>
      <h6 style="color: var(--text-sub);">Creator <span class="text-lowercase">(total)</span>: {{ challenge.creator.reputation }}</h6>
    </div>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge'
import { computed } from 'vue'
import { AppState } from '../../AppState'
export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    },
    bgColor: {type: String, required: true},
    color: {type: String, required: true},
    themeStyle: {type: Boolean, required: true, default: false}
  },
  setup(props) {
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

    return {
      isCreator,
      isParticipant,
    }
  }
}
</script>

<style scoped lang="scss">
.details-card {
  position: relative;
  .button-container {
    >button {
      position: absolute;
      top: 0;
      left: 50%;
      right: 50%;
      width: 150px;
      height: 40px;
      transform: translateX(-50%);
      outline: none !important;
      clip-path: polygon(0 0, 100% 0, 90% 100%, 10% 100%, 0 0);
      border-bottom-left-radius: 25%;
      border-bottom-right-radius: 25%;
    }
  }
  .mdi-account-star-outline {
    position: relative;
    top: 20%;
    font-size: 3rem;
    transform: translateX(-10%);
  }
  .circle-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    .circle {
      position: absolute;
      top: 0;
      right: 35%;
      transform: translateY(-85%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      box-shadow: inset 0 0 0 2px #2a8f4c;
      border-radius: 50%;
      background-color: #38BB64;
      color: white;
      font-size: 1.1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      @media screen and (max-width: 1200px) {
        right: 15%;
      }
      @media screen and (max-width: 992px) {
        right: 5%;
      }
      @media screen and (max-width: 768px) {
        right: 40%;
      }
    }
  }


}
</style>