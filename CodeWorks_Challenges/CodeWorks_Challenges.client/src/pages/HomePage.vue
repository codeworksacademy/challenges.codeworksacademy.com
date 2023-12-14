<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12 col-lg-7 calc-vh text-white d-flex justify-content-center align-items-center">
        <div class="my-4 mx-2">
          <p class="highlight-text rounded fs-6 p-2 px-3 text-center text-md-start">
            Complete Applications, With Feedback and Grading
          </p>
          <p class="hero-font fs-1">
            Pursue New Projects
          </p>
          <p class="hero-font fs-1">
            Showcase Your Skills
          </p>
          <p class="hero-font fs-xl">
            Build Your Portfolio!
          </p>
          <p>
            Empower Your Future and Career with Software Development Challenges
          </p>
          <router-link to="Challenges">
            <button class="btn btn-aqua btn-lg">
              Browse Challenges
            </button>
          </router-link>
        </div>
      </div>

      <div class="col-5 p-0 d-none d-lg-block">
        <img src="https://images.unsplash.com/photo-1509966756634-9c23dd6e6815?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="hero image" class="calc-vh mw-100">
      </div>
    </section>
  </div>
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

.hero-font{
  font-family: 'Lekton', sans-serif;
}

.fs-xl{
  font-size: 3rem;
}

.highlight-text{
  background-color: #00cbe619;
  color: #00CCE6;
  width: fit-content;
}

.btn-aqua{
  background-color: #00CCE6;
  color: black;
}

.btn-aqua:active{
  border: 1px solid #00CCE6;
  color: #00CCE6;
}

.btn-aqua:hover{
  border: 1px solid #00CCE6;
  color: #00CCE6;
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