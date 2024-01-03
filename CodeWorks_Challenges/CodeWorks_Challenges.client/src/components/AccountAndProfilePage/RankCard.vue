<template>
  <section class="rank-card-style row my-2 my-md-0 p-1 m-1 mx-0">
    <div class="d-flex flex-row">
      <div class="col-4 d-flex justify-content-center align-items-center">
        <div class="badge badge-color position-relative" id="collaborator">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="100px" height="105px" viewBox="0 0 216 232">
            <path :fill="currentRankBadge.FILL_PATH"
            d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,9c0,28.23-0.006,151.375,0,169c0.005,13.875,94.499,54,107.999,54S216,191.57,216,178V9C216,3.298,212.732,0,207,0z"/>
          </svg>
          <div class="text-uppercase">
            <p class="title pt-3"> {{ currentRankBadge.NAME }} </p>
            <p class="subtitle"> {{ currentRankBadge.DESCRIPTION }} </p>
            <span class="badge-icon" :class="['mdi', currentRankBadge.MDI_ICON]"></span>
          </div>
        </div>
      </div>
      <div class="col-8 m-auto mt-3">
        <div class="col-12 d-flex flex-column justify-content-center align-items-center text-white mb-2">
          <div class="col-12">
            <h4> Rank Progress </h4>
          </div>
          <div class="col-12">
          <p> 
            <span class="theme-color fw-semibold mb-2">{{ rankBadgePercentage }}</span> towards {{ nextRankBadge.NAME }}
          </p>
          </div>
          <div class="col-12">
          <div class="progress" style="height: 5px; background-color: #0B1019;">
              <div class="progress-bar theme-style-box" role="progressbar" :style="{ width: rankBadgePercentage }" style="background-color: #F2FAC4;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from "vue"
import { AppState } from "../../AppState"
export default {
  setup() {
    const currentRankBadge = computed(() => {
      let lastKey = 0
      for (const key in AppState.rankBadges) {
        if (AppState.account.rank >= key) {
          lastKey = key
        }
      }
      return AppState.rankBadges[lastKey]
    })

    const rankBadgePercentage = computed(() => {
      const rankBadgeKeys = Object.values(AppState.rankThresholds);
      const rank = AppState.account.rank;
      const nextKey = rankBadgeKeys.find(key => key > rank);
      if (!nextKey) {
        return '100%';
      }
      const percentage = (rank / nextKey) * 100;
      return `${percentage.toFixed(1)}%`;
    });

    const nextRankBadge = computed(() => {
      const rankBadgeKeys = Object.keys(AppState.rankBadges);
      const rank = AppState.account.rank;
      const nextKey = rankBadgeKeys.find(key => key > rank);
      if (!nextKey) {
        return 'Celestial Scripter Reached! Final rank achieved!!';
      }
      return AppState.rankBadges[nextKey];
    });

    return {
      currentRankBadge,
      rankBadgePercentage,
      nextRankBadge,

      currentBadgeGradient: computed(() => {
        return `linear-gradient(90deg, ${currentRankBadge.value.COLOR} 0%, ${nextRankBadge.value.COLOR} 100%)`
      }),
      currentBadgeColor: computed(() => {
        return currentRankBadge.value.COLOR
      })
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

.rank-card-style{
  background-color: #3e53742a;
  border: 1px solid #3E5374;
  border-radius: .5rem;
  height: 9rem;
}

@mixin setColor($currentBadgeGradient) {
  .title {
    background-color: $currentBadgeGradient;
  }
  .subtitle:after {
    color: $currentBadgeGradient;
  }
}
.badge {
  position: relative;
  width: 100px;
  display: inline-block;
  margin: 15px 0;
  filter: drop-shadow(0 0 10px var(--bg-sub));
  transform: scale(.9);
  .title {
    font-family: "Montserrat", sans-serif;
    font-weight: bold;
    font-size: .9em;
    text-shadow: 0 0 4px #000;
    position: absolute;
    top: -10px;
    border-radius: 8px 8px 0 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 35px;
    background: v-bind(currentBadgeGradient);
    padding: 12px 0;
  }
  .subtitle {
    position: absolute;
    font-family: "Fjalla One", sans-serif;
    font-size: .8em;
    width: 100%;
    text-align: center;
    color: #fff;
    text-shadow: 0 .5px 1px #000;
    top: 40px;
    word-spacing: 2px;
  }
  .badge-icon {
    position: absolute;
    top: 55%;
    left: 55%;
    transform: translate(-40%, -15%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    color: white;
    text-shadow: 0 2px 1px #000;
    transition: all .2s ease-in-out; 
    &:hover {
      top: 53%;
      transition: all .2s ease-in-out; 
    }
  }
}
.badge-color {
  @include setColor(currentBadgeGradient);
}
</style>