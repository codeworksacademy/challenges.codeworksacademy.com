<template>
  <section class="container-fluid">
    <div class="d-flex align-items-center justify-content-center">
      <div class="row">
        <div class="col-12 text-light text-center">
          <h1>I DEVELOP, THEREFORE I<br /> BECOME</h1>
          <p class="mx-auto" style="width: 60%; color: #797A7A;"> Explore <span class="span-1">challenges</span>, showcase your <span class="span-2">skills</span>, and immerse yourself in the transformative world of <span class="span-3">development</span>.<br />A philosophy that propels us forward, one line of code at a time.</p>
        </div>
      </div>
    </div>

    <div class="row justify-content-center align-items-center">
      <div class="col-6 p-5">
        <router-link :to="{ name: 'Challenges' }">
          <div class="card home-card p-3" style="height: 30vh;">
            <div class=" d-flex flex-row text-light">

              <div class="col-6">
                <img src="../assets/img/challenges-img.png" class="img-fluid" style="height: 25vh;" alt="">
              </div>
              <div class="col-6 my-auto">
                <h5 class="pe-4 pb-3">Featured Challenges</h5>
                <p class="sub-text">Handpicked to inspire creativity and hone your coding skills. Whether you're a seasoned developer or just starting your journey, these challenges offer a playground to test your abilities, learn from your peers, and compete for exciting rewards!</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-6 p-5">
        <div class="card home-card p-3" style="height: 30vh;">
          <div class=" d-flex flex-row text-light">

            <div class="col-5 ps-4">
              <img src="../assets/img/leaderboard-img.png" class="img-fluid" style="height: 25vh; transform: scale(.9);" alt="">
            </div>
            <div class="col-6 offset-1 my-auto">
              <h5 class="pb-3">Leaderboards</h5>
              <p class="sub-text">See how your skills stack up agains fellow CodeWorkers! Compete in coding challenges, showcase your projects, and earn your place among the tech elite. Keep an eye on the rankings, claim your position, and let the world see your coding prowess!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'

export default {

  setup() {
    return {
      challenges: computed(() => AppState.challenges),
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/variables.scss';

.span-1 {
  color: var(--primary-green);
  font-weight: 500;
}

.span-2 {
  color: var(--secondary-magenta);
  font-weight: 500;
}

.span-3 {
  color: var(--tertiary-orange);
  font-weight: 500;
}

.home-card {
  background: var(--bg-main);
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.25);
}

p.sub-text {
  font-size: .85rem;
  font-weight: 500;
}
</style>