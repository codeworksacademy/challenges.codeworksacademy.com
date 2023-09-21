<template>
  <div v-if="challenge" :key="challenge.id" class="col-4 d-flex justify-content-center align-items-center p-3">
    <div class="color-chase-card card" style="height: 25vh; width: 33vw;">
      <div :class="randomizeBgImg()" class="card-body">
        <h4 class="card-title"> {{ challenge.name }} </h4>
        <h6 class="card-subtitle mb-2" style="filter: brightness(.4);"> {{ challenge.createdAt }} </h6>
          <div class="col-12 text-center">
            <p v-if="challenge.description" class="card-text" style="min-width: 100%; margin-top: 1em;">
              {{ challenge.description }}
            </p>
            <p v-else class="card-text" style="min-width: 100%; margin-top: 1em;">
              No description provided.
            </p>
          </div>
        <div class="card-line-animation"></div>
        <a :href="challenge.supportLinks" class="btn btn-primary">Challenge Details</a>
        <a class="btn btn-secondary">Close</a>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import { Challenge } from "../models/Challenge.js"

export default {

  props: {
    challenge: { type: Challenge, required: true }
  },
  setup() {

    const randomBgImg = [
      'bg-1',
      'bg-2',
      'bg-3',
      'bg-4',
      'bg-5',
      'bg-6'
    ]

    return {
      challenges: computed(() => AppState.challenges),

      randomizeBgImg() {
        return randomBgImg[Math.floor(Math.random() * randomBgImg.length)]
      }
    }
  }
}

</script>

<style scoped lang="scss">

.bg-1 {
  background-image: url(../assets/img/challenges-img.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1;
}

.bg-2 {
  background-image: url(../assets/img/leaderboard-bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1;
}

.bg-3 {

}

.bg-4 {

}

.bg-5 {

}

.bg-6 {

}

.color-chase-card {
  height: 100%;
  padding: 0.6em 2em;
  border: none;
  outline: none;
  color: #fff;
  background: #1c1c20d6;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  transition: all 0.5s ease-in-out;
}

.color-chase-card:hover {
   box-shadow: 0 0 10px #BB388F;
   filter: brightness(1.1);
    .card-line-animation {
      height: 1px;
      background: #BB6438;
      position: absolute;
      top: 70%;
      left: 0;
      transform: translateY(-50%);
      opacity: 0;
      animation: lineAnimation 1s ease-in-out forwards;
      transition: all .5s ease-in-out;
    }
}

.color-chase-card:before {
  content: "";
  background: linear-gradient(
    45deg,
    #38BB6499,
    #388FBB,
    #BB388F,
    #BB6438,
    #38BB64
  );
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: colorChase 60s linear infinite;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

@keyframes colorChase {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.color-chase-card:after {
  z-index: -1;
  content: "";
  position: absolute;
  background: #222222ff;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 10px;
}

.card-subtitle {
  font-size: .8rem;
  font-weight: 300;
  color: #fff;
  text-align: center;
  z-index: 1;
}

.card-text {
  font-size: .8rem;
  background-color: #1c1c20d6;
  padding: 1rem;
  border-radius: 10px;
  position: relative;
  top: 0;
  width: 100%;
  box-shadow: 0 0 10px 5px #1c1c20d6;
}

@keyframes lineAnimation {
  from {
    width: 0;
    opacity: 1;
  }
  to {
    width: 100%;
    opacity: 1;
  }
}

.btn-primary {
  position: absolute;
  bottom: 5%;
  right: 50%;
  font-size: .8em;
}

.btn-secondary {
  position: absolute;
  bottom: 5%;
  left: 70%;
  font-size: .8em;
}
</style>