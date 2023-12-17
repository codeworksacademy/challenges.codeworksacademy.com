<template>
    <div class="rank-badge-card d-flex justify-content-center align-items-center bg-dark text-light p-2">
      <div class="col-4 d-flex flex-column justify-content-center align-items-center text-uppercase">
        <span style="font-size: .85rem;">
          <b>Current Badge</b>
        </span>
        <img :src="currentRankType.IMAGE_URL" alt="next rank type" class="img-fluid" height="100" width="100">
        <span style="font-size: .75rem;">
          <b>{{ currentRankType.NAME }}</b>
        </span>
        <span style="font-size: .75rem;">
          {{ currentRankType.DESCRIPTION }}
        </span>
      </div>
      <div class="col-4 d-flex flex-column justify-content-center align-items-center text-uppercase">
        <div style="width:100%">
          <div class="progress" role="progressbar" aria-label="example" aria-valuenow="50" aria-valuemin="0"
            aria-valuemax="100">
            <div class="progress-bar" :style="{ width: rankTypePercentage }"> {{ rankTypePercentage }}</div>
          </div>
          <span class="fst-italic text-capitalize d-flex justify-content-center" style="font-size: .75em; white-space: nowrap;">Progress to next badge...</span>
        </div>
      </div>
      <div class="col-4 d-flex flex-column justify-content-center align-items-center text-uppercase text-white-50">
        <span style="font-size: .85rem;">
          <b>Next Badge</b>
        </span>
        <div class="d-flex flex-column justify-content-center align-items-center" style="filter: blur(1.5px);">
          <img :src="nextRankType.IMAGE_URL" alt="next rank type" class="img-fluid" height="100" width="100" style="filter: grayscale(.5);">
          <span style="font-size: .75rem;">
            {{ nextRankType.NAME }}
          </span>
          <span style="font-size: .75rem;">
            {{ nextRankType.DESCRIPTION }}
          </span>
        </div>
      </div>
    </div>
</template>

<script>
import { computed } from "vue"
import { AppState } from "../../AppState"
export default {
  setup() {
    return {
      rankTypePercentage: computed(() => {
        const rankTypesKeys = Object.keys(AppState.rankTypes);
        const rank = AppState.account.rank;
        const nextKey = rankTypesKeys.find(key => key > rank);
        if (!nextKey) {
          return '100%';
        }
        const percentage = (rank / nextKey) * 100;
        return `${percentage.toFixed(1)}%`;
      }),
      currentRankType: computed(() => {
        let lastKey = 0
        for (const key in AppState.rankTypes) {
          if (AppState.account.rank >= key) {
            lastKey = key
          }
        }

        return AppState.rankTypes[lastKey]
      }),
      nextRankType: computed(() => {
        const rankTypesKeys = Object.keys(AppState.rankTypes);
        const rank = AppState.account.rank;
        const nextKey = rankTypesKeys.find(key => key > rank);
        if (!nextKey) {
          return 'Celestial Scripter Reached! Final rank achieved!!';
        }
        return AppState.rankTypes[nextKey];
      }),
    }
  }
}
</script>

<style scoped lang="scss"></style>