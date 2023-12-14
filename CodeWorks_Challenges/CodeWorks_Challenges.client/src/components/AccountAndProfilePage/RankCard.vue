<template>
  <section class="rank-card-style bg-dark text-light row m-2 mb-3 p-2 rounded">
      <div class="col-12 fs-2">
        {{ currentRank }}
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-md-3 col-12 d-flex align-items-end">
            <span>
              CURRENT RANK
            </span>
          </div>
          <div class="col-md-9 col-12 text-start text-md-end">
            <span>
              NEXT RANK: {{ nextRank.toUpperCase() }}
            </span>
            <div class="progress" role="progressbar" aria-label="example" aria-valuenow="50" aria-valuemin="0"
              aria-valuemax="100">
              <div class="progress-bar" :style="{ width: rankPercentage }"> {{ rankPercentage }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>


<script>
import { computed } from 'vue'
import { AppState } from '../../AppState'

export default {
  setup(){
    return {
      currentRank: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (AppState.account.rank >= key) {
            lastKey = key
          }
        }

        return AppState.rankTitles[lastKey]
      }),

      rankPercentage: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (AppState.account.rank >= key) {
            lastKey = key
          }
        }

        let keys = Object.keys(AppState.rankTitles)
        let nextIndex = keys.indexOf(lastKey) + 1
        if (nextIndex == -1) {
          return `100%`
        }

        let nextKey = keys[nextIndex]

        let percentage = (AppState.account.rank / nextKey) * 100

        let finalPer = percentage.toFixed(1)

        return `${finalPer}%`
      }),

      nextRank: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (AppState.account.rank >= key) {
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

</style>