<template>
<section class="container-fluid">
  <div class="position-relative bottom-0">
    <div class="badge gold" id="completionist">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="100px"
        height="105px"
        viewBox="0 0 216 232"
      >
        <path
          fill="#2b3037"
          d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,9c0,28.23-0.006,151.375,0,169c0.005,13.875,94.499,54,107.999,54S216,191.57,216,178V9C216,3.298,212.732,0,207,0z"
        />
      </svg>
      <div class="text-uppercase">
        <p class="title pt-3">Completionist</p>
        <p class="subtitle-line-one">Complete All Checks</p>
        <p class="subtitle-line-two">on 15 Challenges</p>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import { ref } from 'vue'

export default {
  setup(props) {

    const badgeName = ref({
      name: 'Completionist',
      description: 'Complete All Checks',
      image: 'https://i.imgur.com/2ZQ4U0w.png'
    })

    return {

    }
  }
}
</script>

<style scoped lang="scss">
</style>