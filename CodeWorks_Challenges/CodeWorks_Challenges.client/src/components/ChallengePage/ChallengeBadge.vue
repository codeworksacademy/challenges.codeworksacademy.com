<template>
  <div :title="challenge.name" class="col-3 badge badge-color position-relative mt-3" id="collaborator">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="130px" height="140px" viewBox="0 0 216 232">
      <defs>
        <linearGradient id="badgeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" :style="{ stopColor: badge?.secondaryColor }" style="stop-opacity: 1" />
          <stop offset="20%" :style="{ stopColor: badge?.primaryColor }" style="stop-opacity: 1;" />
          <stop offset="70%" :style="{ stopColor: badge?.secondaryColor }" style="stop-opacity: 1" />
        </linearGradient>
      </defs>
      <path d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,0c0,28.23-0.006,51.375,0,159c0.005,19.875,115.499,54,107.999,54S216,179,216,159V9C216,3.298,212.732,0,207,0z" stroke-width="50" stroke="url(#badgeGradient)" />
      <path id="color-picker" :fill="badge?.primaryColor"
      d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,9c0,28.23-0.006,151.375,0,169c0.005,13.875,115.499,54,107.999,54S216,191,216,178V9C216,3.298,212.732,0,207,0z" />
    </svg>
    <div class="text-uppercase rounded-circle bg-light">
      <span :style="{ background: badge?.secondaryColor, filter: `drop-shadow(0 3px 3px 0 ${badge?.secondaryColor})` }"
       class="title"> {{ badge?.title }} </span>
      <img :src="badge?.image" :alt="`Image of '${badge?.title}'`" class="badge-img img-fluid">
    </div>
  </div>
</template>

<script>
import { filter } from "insane/defaults.js"
import { Challenge } from '../../models/Challenge.js'
import { ref } from 'vue'

export default {
  props: {
    badge: {
      type: Object,
      required: true
    },
    challenge: {
      type: Challenge || Object,
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
  width: 130px;
  height: 140px;
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
    opacity: .1;
  }
  #color-picker {
    position: absolute;
    top: 40px;
  }
  .title {
    font-family: "Montserrat", sans-serif;
    font-weight: 525;
    font-size: 1.15em;
    font-stretch: ultra-condensed;
    text-align: center;
    position: absolute;
    color: var(--shadow-blue);
    letter-spacing: -.75px;
    text-shadow: 0px 1px .5px #000;
    top: -5px;
    left: 50%;
    margin: 0 auto;
    transform: translateX(-50%);
    border-radius: 8px 8px 0 0;
    text-align: center;
    width: 89%;
    height: 35px;
    background: var(--bg-sub);
    padding: 12px 0;
  }
    .badge-img {
      position: absolute;
      top: 27%;
      left: 50%;
      transform: translateX(-50%);
      object-fit: cover;
      object-position: center;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60%;
      height: 60%;
      opacity: .85;
      filter: brightness(1);
    }
}
</style>