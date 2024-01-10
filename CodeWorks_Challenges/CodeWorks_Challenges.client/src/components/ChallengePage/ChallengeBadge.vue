<template>
  <div class="d-flex justify-content-center align-items-center m-auto">
    <div class="badge badge-color position-relative mt-3" id="collaborator">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="100px" height="105px" viewBox="0 0 216 232">
        <path id="color-picker" :fill="challenge.badge.primaryColor"
          d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,9c0,28.23-0.006,151.375,0,169c0.005,13.875,115.499,54,107.999,54S216,191,216,178V9C216,3.298,212.732,0,207,0z" />
      </svg>
      <div class="text-uppercase rounded-circle bg-light">
        <span :style="{ background: challenge.badge.secondaryColor }" class="title"> {{ challenge.badge.title }} </span>
        <div class="img-box">
          <img :src="challenge.badge.image" :alt="`Image of '${challenge.badge.title}' badge for '${challenge.name}' challenge`" class="badge-img img-fluid">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge.js'
import { ref } from 'vue'

export default {
  props: {
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
.title {
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  font-size: 1em;
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
  width: 85.75%;
  height: 30px;
  background: var(--bg-sub);
  padding: 12px 0;
}
.img-box {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 73%;
  height: 73%;
  background: linear-gradient(180deg, #00000050 0%, transparent 100%), #00000050;
  clip-path: polygon(7% 80%, 7% 27%, 93% 27%, 93% 80%, 50% 100%);
  .badge-img {
    position: absolute;
    top: 11%;
    left: 50%;
    transform: translateX(-50%);
    background-position: center;
    background-size: cover;
    display: block;
    width: 80%;
    height: 80%;
    clip-path: polygon(5% 80%, 5% 27%, 95% 27%, 95% 80%, 50% 100%);
  }
}
</style>