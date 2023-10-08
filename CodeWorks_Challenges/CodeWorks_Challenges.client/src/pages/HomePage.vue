<template>
  <section class="container-fluid bg-dark">
    <div class="d-flex align-items-center justify-content-center pt-5">
      <div class="">
        <div class="col-12 text-light text-center">
          <h1>I DEVELOP, THEREFORE I<br /> BECOME</h1>
          <p class="mx-auto" style="width: 60%; color: #797A7A;"> Explore <span class="span-1">challenges</span>, showcase your <span class="span-2">skills</span>, and immerse yourself in the transformative world of <span class="span-3">development</span>.<br />A philosophy that propels us forward, one line of code at a time.</p>
        </div>
      </div>
    </div>

    <div class="col-3 d-flex justify-content-center align-items-center m-auto p-5">
      <router-link
        :to="{ name: 'Challenges' }"
        title="This link routes you to the challenges page"
      >
        <p> Go to Challenges </p>
      </router-link>
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

.container-fluid {
 height: 100vh;
}

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
  box-shadow: var(--shadow-green);
}

p.sub-text {
  font-size: .85rem;
  font-weight: 500;
}
</style>