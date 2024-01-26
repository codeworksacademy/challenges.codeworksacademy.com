<template>
  <div :class="`details-card d-flex justify-content-center align-items-center ${themeStyle ? 'theme-style' : ''} rounded text-capitalize pt-3`" :style="{backgroundColor: bgColor, borderColor: color, borderStyle: 'groove'}">
    <div class="col-12 button-container d-flex justify-content-center align-items-center">
      <button v-if="isParticipant && !gaveReputation" @click="giveReputation" class="me-3"><small>Give Reputation</small></button>
      <button v-if="isParticipant && gaveReputation" @click="giveReputation" class="remove-reputation-hover me-3"><small>Remove Reputation</small></button>
      <button v-if="!isParticipant && !isCreator" class="disabled-title me-3" :title="`You must be a participant of '${challenge.name}' before you can award it's creator with reputation.`" disabled><small>Give Reputation</small></button>
      <button v-if="isCreator" :title="`${challenge.creator.name}'s total Reputation: ${challenge.creator.reputation}`" class="disabled-title me-3" disabled><small>View Reputation</small></button>
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
import { challengesService } from '../../services/ChallengesService'
import Pop from '../../utils/Pop'

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
      giveReputation,
      gaveReputation,
      canGiveReputation: computed(() => {
        if (props.challenge.reputationIds.find(r => r == AppState.AccountState.account.id)) {
          return false
        }
        return true
      }),
      isParticipant: computed(() => {
        const participant = AppState.ChallengeState.participants.find(p => p.accountId === AppState.AccountState.account.id)
        return participant
      }),
      isCreator: computed(() => {
        if (AppState.AccountState.account.id === props.challenge.creator.id) {
          return true
        }
        return false
      }),
    }
  }
}
</script>

<style scoped lang="scss">
.details-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .button-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 23%;
    z-index: 1;
    &:before, &:after {
      content:"";
      position: absolute;
      top: -1px;
      width: 65%;
      height: 87%;
      border-radius: 10%;
      box-shadow: inset 25px 3px 0 0px #38BB64, inset 28px 3px 0 0 #6F42C1;
      filter: blur(1.5px);
      z-index: -1;
    }
    &:before {
      right: 69.5%;
      transform: rotate(-.5deg) scale(-1, 1) skewX(-50deg);
      clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
    }
    &:after {
      left: 69.5%;
      transform: rotate(.75deg) skewX(-50deg);
      clip-path: polygon(0 0, 100% 0, 100% 60%, 0 60%);
    }
    >button {
      position: absolute;
      top: -1px;
      left: 50%;
      right: 50%;
      width: 60%;
      height: 23%;
      color: #38BB64;
      font-size: .9rem;
      font-weight: 600;
      text-shadow: 0 0 1px var(--shadow-blue);
      transform: translateX(-50%);
      outline: none !important;
      border: none !important;
      background-color: transparent;
      transition: .5s ease-in-out all;
      &:hover {
        color: var(--text-main);
        text-shadow: 0 1px 1px var(--border-dark);
        transition: .5s ease-in-out all;
        &:after {
        border-top-color: #1D213A;
        box-shadow: none !important;
        filter: blur(.5px) brightness(1.4) saturate(1) drop-shadow(0 2px 2px #343b68);
        transition: .5s ease-in-out all;
        }
      }
      &:after {
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 30px solid #1D213A;
        filter: drop-shadow(0 2px 2px #343b68);
        border-bottom-left-radius: 45%;
        border-bottom-right-radius: 45%;
        transition: .3s ease-in-out;
        z-index: -1;
      }
      &:before {
        content:"";
        position: absolute;
        top: -5px;
        left: 50%;
        right: 50%;
        width: 80%;
        height: 100%;
        box-shadow: 0px 14.5px 1px 25px #38bb64;
        border-radius: 40%;
        transform: translateX(-50%) perspective(100px) rotateX(-20deg);
        filter: blur(2px);
        z-index: -1;
      }
      
    }
    button.remove-reputation-hover {
      color: var(--shadow-orange);
      text-shadow: 0 0 1px var(--shadow-purple);
      box-shadow: inset 25px 3px 0 0px #38BB64, inset 28px 3px 0 0 #6F42C1;
      filter: brightness(.9);
      &:after {
        border-top-color: #1D213A;
        filter: blur(.5px) brightness(.9) saturate(.75) drop-shadow(0 1px 2px #343b68);
        transition: .5s ease-in-out all;
      }
      &:hover {
        border-top-color: #6F42C1;
        filter: saturate(.5) drop-shadow(0 2px 2px #343b68);
        transition: .5s ease-in-out all;
      
      }
      &:before {
        box-shadow: 0px 4px 1px 5px #bb8d38;
        transform: translateX(-50%) perspective(100px) rotateX(-20deg) scale(1.1);
        filter: blur(2px) brightness(.9);
      }
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
      box-shadow: inset 0 0 2px 2px #1c5b2f99;
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
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1200px) {
    .button-container {
      &:before, &:after {
        width: 35%;
        height: 67%;
        border-radius: 15%;
      }
    }
  }


}
</style>