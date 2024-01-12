<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12 col-lg-6 calc-vh text-white d-flex justify-content-center align-items-center" style="">
        <div class="my-4 mx-2">
          <p class="highlight-text rounded fs-5 p-2 px-3 text-center text-md-start">
            Complete Applications, With <b>Feedback</b> and <b>Grading</b>
          </p>
          
          <p class="hero-font fs-2">
            <span style="color: var(--shadow-green)">Pursue</span> New Projects
          </p>
          <p class="hero-font fs-2">
            <span style="color: var(--shadow-orange)">Showcase</span> Your Skills
          </p>
          <p class="hero-font fs-2">
            <span style="color: var(--shadow-purple)">Build</span> Your Portfolio
          </p>
          <p class="hero-font fs-2">
            <span style="color: var(--shadow-blue)">Empower Your Career</span> with Software Development!
          </p>
          <div class="ps-0 ms-0 mt-3">
            <BlueButton buttonContent="Browse Challenges" />
          </div>
        </div>
      </div>

      <div class="col-6 img-fluid hero-container">
        <img src="https://i.gifer.com/origin/24/2457c47e228105862d2ce726fc60f7ad_w200.gif" alt="" class="twinkle-logo">
        <img src="../assets/img/codeworks-logo.svg" alt="" class="hero">
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import BlueButton from '../components/ButtonComponents/BlueButton.vue'

export default {
  setup() {
    return {
      challenges: computed(() => AppState.challenges),
    }
  },
  components: {
    BlueButton
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/_root.scss';

.hero-container {
  position: relative;
  top: -5%;
  overflow: hidden;
  .twinkle-logo {
    position: absolute;
    top: 30%;
    right: 50%;
    width: 15%;
    z-index: 2;
    opacity: 0;
    animation: twinkle 1s ease-in-out 2.7s forwards;
    @keyframes twinkle {
      0% { opacity: 0; }
      30% { opacity: 1; }
      100% { opacity: 0; }
    }
    @media screen and (max-width: 1200px) {
      top: 25%;
      right: 45%;
    }
  }
  .hero {
    position: absolute;
    top: -29%;
    right: -70.3%;
    width: 200%;
    animation: rollIn 4s ease-in-out forwards;
    @media screen and (max-width: 1200px) {
      top: -15%;
      right: -70.3%;
      width: 200%;
    }
    @keyframes rollIn {
      0% { opacity: 0; transform: translateX(75%) rotate(90deg); }
      60% { opacity: .5; transform: translateX(0) rotate(0); }
      75% { opacity: 1; transform: translateX(0) rotate(0); }
      100% { opacity: .7; transform: translateX(0) rotate(0); }
    }
  }
}
.hero-font{
  font-family: 'Lekton', sans-serif;
}

.fs-xl{
  font-size: 3rem;
}

.highlight-text{
  background-color: #1da3e619;
  font-family: 'Lekton', sans-serif;
  color: var(--shadow-blue);
  width: fit-content;
}

.calc-vh{
  height: calc(100vh - 64px);
}

@media (min-width: 768px) {
  .fs-xl{
    font-size: 4rem;
  }
}
</style>