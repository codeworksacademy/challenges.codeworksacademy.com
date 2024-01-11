<template>
  <div class="col-3 badge badge-color position-relative mt-3" id="collaborator">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="100px" height="105px" viewBox="0 0 216 232">
      <defs>
        <linearGradient id="badgeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: black; stop-opacity: 1" />
          <stop offset="30%" :style="{ stopColor: challenge.badge?.primaryColor }" style="stop-opacity: 1;" />
          <stop offset="50%" style="stop-color: black; stop-opacity: 1" />
        </linearGradient>
      </defs>
      <path d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,0c0,28.23-0.006,51.375,0,159c0.005,19.875,115.499,54,107.999,54S216,179,216,159V9C216,3.298,212.732,0,207,0z" stroke-width="50" stroke="url(#badgeGradient)" />
      <path id="color-picker" :fill="challenge.badge?.primaryColor"
      d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,9c0,28.23-0.006,151.375,0,169c0.005,13.875,115.499,54,107.999,54S216,191,216,178V9C216,3.298,212.732,0,207,0z" />
    </svg>
    <div class="text-uppercase rounded-circle bg-light">
      <span :style="{ background: challenge.badge?.secondaryColor }" class="title"> {{ challenge.badge?.title }} </span>
      <div class="img-box">
        <img :src="challenge.badge?.image" :alt="`Image of '${challenge.badge?.title}' badge for '${challenge?.name}' challenge`" class="badge-img img-fluid">
      </div>
    </div>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge.js'
import { ref } from 'vue'
import { ChallengeParticipant } from "../../models/ChallengeParticipant.js"

export default {
  props: {
    challenge: {
      type: Challenge || ChallengeParticipant || Object,
      required: true
    }
  },
  setup() {
    //Select the background color for the upper badge title
    const selectedBackground = ref('')
    
    //Select the SVG color fill for the body of the badge
    const selectedFill = ref('')
    const clipPath = ref('url(#color-picker)')
    return {
      selectedFill,
      selectedBackground,
      clipPath
    }
  }
}
</script>

<style scoped lang="scss">
.badge {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 105px;
  margin: 0 auto;
  //Make it so there are only 3 badges per row:
  flex-wrap: wrap;
  
  &:before {
    background-image: url('../../assets/img/codeworks-logo.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    content: '';
    position: absolute;
    top: -10.5%;
    left: 50%;
    transform: translateX(-50%) rotate(30deg);
    width: 130%;
    height: 130%;
    opacity: .25;
  }
  #color-picker {
    position: absolute;
    top: 40px;
  }
  .title {
    font-family: "Montserrat", sans-serif;
    font-weight: 525;
    font-size: .95em;
    text-align: center;
    position: absolute;
    color: var(--shadow-blue);
    letter-spacing: -.7px;
    text-shadow: 0px 1px .5px #000;
    top: -5px;
    left: 50%;
    margin: 0 auto;
    transform: translateX(-50%);
    border-radius: 8px 8px 0 0;
    text-align: center;
    width: 89%;
    box-shadow: 0 3px 3px rgba(0, 0, 0, .75);
    height: 35px;
    background: var(--bg-sub);
    padding: 12px 0;
  }
  .img-box {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    width: 73%;
    height: 73%;
    clip-path: polygon(12% 78%, 12% 30%, 88% 30%, 88% 77%, 50% 95%);
    background: linear-gradient(90deg, #00000060 20%, var(--shadow-blue) 50%, #00000060 80%);
    .badge-img {
      position: absolute;
      top: 11%;
      left: 50%;
      transform: translateX(-50%);
      object-fit: cover;
      object-position: center;
      background-size: cover;
      display: block;
      width: 80%;
      height: 80%;
      clip-path: polygon(5% 80%, 5% 27%, 95% 27%, 95% 80%, 50% 100%);
      opacity: .85;
      filter: brightness(1.2);
    }
  }
}
</style>