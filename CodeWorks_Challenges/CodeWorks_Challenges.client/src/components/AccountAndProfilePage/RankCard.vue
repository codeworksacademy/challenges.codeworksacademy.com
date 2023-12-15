<template>
  <section class="rank-card-style row my-2 my-md-0 p-1 m-1">
    <div class="col-4 fs-1 lekton-text text-white fw-semibold d-flex align-items-center justify-content-center">
      {{ currentRank }}
    </div>
    <div class="col-6 my-auto">
      <div class="">
        <p class="text-white-50 m-0">
          RANK PROGRESS
        </p>
        <p class="text-white">
          <span class="theme-color fw-semibold">{{ rankPercentage }}</span> towards {{ nextRank }}
        </p>
      </div>
      <div class="d-none d-md-block">
        <div class="progress" style="height: 5px; background-color: #0B1019;">
          <div class="progress-bar theme-style-box" role="progressbar" :style="{ width: rankPercentage }" style="background-color: #F2FAC4;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
    <div class="col-2 d-flex align-items-center justify-content-center ">
      <i class="mdi mdi-star-four-points-circle theme-color theme-style fs-0"></i>
    </div>
  </section>
</template>


<script>
import { computed } from 'vue'
import { AppState } from '../../AppState'

export default {
  props:{
    userRank: {type: Number, required: true}
  },

  setup(props){
    return {
      currentRank: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (props.userRank >= key) {
            lastKey = key
          }
        }

        return AppState.rankTitles[lastKey]
      }),

      rankPercentage: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (props.userRank >= key) {
            lastKey = key
          }
        }

        let keys = Object.keys(AppState.rankTitles)
        let nextIndex = keys.indexOf(lastKey) + 1
        if (nextIndex == -1) {
          return `100%`
        }

        let nextKey = keys[nextIndex]

        let percentage = ((props.userRank - lastKey) / (nextKey - lastKey)) * 100

        let finalPer = percentage.toFixed(1)

        return `${finalPer}%`
      }),

      nextRank: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (props.userRank >= key) {
            lastKey = key
          }
        }

        let keys = Object.keys(AppState.rankTitles)
        let nextIndex = keys.indexOf(lastKey) + 1
        if (nextIndex == -1) {
          return 'You have reached the last rank!'
        }
        let nextKey = keys[nextIndex]

        return AppState.rankTitles[nextKey]
      }),
    }
  }
}
</script>


<style lang="scss" scoped>
.theme-style{
  text-shadow: 0px 0px 15px #cbd4a57b;
}

.lekton-text{
  font-family: 'Lekton', sans-serif;
}

.theme-color{
  color: #F2FAC4;
}

.fs-0{
  font-size: 3.25rem;
}

.rank-card-style{
  background-color: #3e53742a;
  border: 1px solid #3E5374;
  border-radius: .5rem;
  height: 7rem;
}
</style>