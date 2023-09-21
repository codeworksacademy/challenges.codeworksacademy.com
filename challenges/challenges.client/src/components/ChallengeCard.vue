<template>
  <section v-if="challenge" :key="challenge.id" class="col-md-4 d-flex justify-content-center align-items-center p-3 position-relative">
    <!--SECTION  * * * CARD IMAGE HEADER * * * ------------------------------>
      <div class="card card-custom border-white border-0" style="height: auto;">
        <div class="card-custom-img" :style="`background-image: url(${challenge.coverImg})`"></div>
        <div>
          <p class="host-badge">FEATURED</p>
        </div>
        <div class="card-custom-avatar">
          <img class="img-fluid object-fit-cover" src="https://i.imgur.com/8Km9tLL.png" alt="Creator Name" />
        </div>
        <!--SECTION * * * CARD BODY * * * ------------->
        <div class="card-body" style="overflow-y: auto">
          <h6 class="card-title fw-bold pt-2"> Item Name </h6>
          <p class="card-text-secondary mb-3 fw-bold"> Item Category </p>
          <p class="card-text">This is a content box that contains the description for the given item. Fill this space with desired content so the user will know what the item they're browsing is all about!</p>
          <p class="card-footer-text text-end">Remaining Items: 27</p>
          <p class="card-text"></p>
        </div>
        <!--SECTION * * * CARD FOOTER * * * -------------------------------------------->
        <div class="card-footer row" style="background: inherit; border-color: #38BB6499;">
          <div class="col-12">
            <p class="card-text">
              <small class="card-text" style="font-weight: 400; font-size: .6rem;">
                Last Updated on: {{ 
                  new Date( )
                  .toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  }) }}
                  @ {{ 
                    new Date( )
                    .toLocaleTimeString('en-US', {
                      hour: 'numeric', 
                      minute: 'numeric'
                    }) }}
              </small>
            </p>
          </div>
          <div class="col-6">
            <a href="#" class="btn btn-dark pb-3" style="">To Top</a>
          </div>
          <div class="col-6">
            <a href="#" aria-label="Go to Tournament Page" class="btn btn-outline-primary">More Info</a>
          </div>
        </div>
      </div>   
</section>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import { Challenge } from "../models/Challenge.js"

export default {

  props: {
    challenge: {
      type: Challenge,
      required: true
    }
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
    }
  }
}

</script>

<style scoped lang="scss">
.container-fluid {
  --bs-gutter-x: 0;
}

.game-img {
  aspect-ratio: 1/.5;
  box-shadow: 0 0 15px 15px #000000;
  filter: drop-shadow(0 0 15px 15px #000000);
}

.card-custom {
  color: #efefef;
  text-shadow: 0 1px 5px #998ce2;
  overflow: hidden;
  max-height: 350px;
  background-color: #0a0b14f3;
  box-shadow: 0 0 15px 2px #0a0a0a4d;
  transition: all .5 ease-in-out;
}

.card-custom-img {
  height: 130px;
  min-height: 130px;
  background-color: #00000090;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  opacity: .8;
  filter: brightness(1.3);
  box-shadow: 0 10px 0 10px #0a0a0a4d;
  border-color: inherit;
}

/* First border-left-width setting is a fallback */
.card-custom-img::after {
  position: absolute;
  content: '';
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-top-width: 0;
  border-right-width: 0;
  border-bottom-width: 20px;
  border-left-width: 350px;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: #0b0d12;
  transform: rotateZ(180deg);
}

.card-custom-avatar img {
  border-radius: 50%;
  box-shadow: 0 0 15px 3px #0a0a0a9a;
  position: absolute;
  border: 2.5px solid #000000;
  top: 85px;
  right: 1.5rem;
  width: 65px;
  height: 65px;
}

.host-badge {
  padding: .25rem;
  font-size: .7rem;
  text-align: center;
  background-color: rgb(249, 196, 80);
  color: aliceblue;
  text-shadow: 1px 1px 1px #000;
  border-radius: 3rem;
  width: 5vw;
  position: absolute;
  top: .5rem;
  right: .5rem;
  background-image: linear-gradient(linear, left top, right top, color-stop(0%, #1e0a0a00), color-stop(25%, #1e0a0a00), color-stop(60%, #fff6b0d9), color-stop(100%, #1e0a0a00));
  background-image: linear-gradient(120deg, #1e0a0a00 0%, #1e0a0a00 25%, #fff6b0d9 60%, #1e0a0a00 100%);
  background-repeat: repeat-y;
  background-position: -100px 0;
  animation: goldShimmer 6s linear infinite;
}

@keyframes goldShimmer {

  0% {
    background-position: -800px 0
  }

  50% {
    background-position: -200px 0
  }

  100% {
    background-position: 100px 0
  }
}

.card-body {
  background-color: #0a0b14f3;
}

.card-text {
  font-size: .66rem;
  font-weight: 400;
  color: #efefef;
  text-shadow: 0 1px 5px #998ce2;
}

.card-text-secondary {
  font-size: .75rem;
  font-weight: 400;
  color: #efefef;
  text-shadow: 0 1px 5px #998ce2;
}

.card-footer-text {
  font-size: .69rem;
  font-weight: 400;
  color: #efefef;
  text-shadow: 0 1px 5px #998ce2;
}

.card-custom:hover {
  filter: brightness(1.1);
  transition: all .5s ease-in-out;
}

a.btn-dark {
  margin-top: 1rem;
  margin-bottom: .25rem;
  height: 10%;
  width: 50%;
  box-sizing: content-box;
  font-size: .75rem;
  font-weight: 400;
  text-shadow: .5px .5px .75px #998ce2;
  color: #efefef;
  border-color: #efefef74;
  transition: .5s ease-in-out;
  
}

a.btn-outline-primary {
  margin-top: 1rem;
  margin-bottom: .25rem;
  height: 25%;
  width: 50%;
  line-height: 1rem;
  box-sizing: content-box;
  font-size: .75rem;
  font-weight: 350;
  color: #67cbe7;
  border-color: #67cbe7;
  transition: .5s ease-in-out;
}

.sub-member {
  color: #67cbe7;
  margin-left: -1.5rem;
}

i.sub-member:hover {
  color: #67cbe7;
  animation: returnUserMargin 1s forwards;
  filter: brightness(1.1) scale(1.1);
  transition: 1s ease-in-out;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: #0a0b14f3;
}

::-webkit-scrollbar-thumb {
  background-color: #29356a;
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background-color: #232642;
}

::-webkit-scrollbar-corner {
  background-color: #0a0b14f3;
}

::-webkit-scrollbar-button {
  background: #efefefc7;
  border-radius: 5px;
  height: 5px;
}



@media screen and (max-width: 1200px) {
  .host-badge {
    width: 8vw;
  }
}

@media screen and (max-width: 992px) {
  .host-badge {
    width: 10vw;
  }
}

@media screen and (max-width: 768px) {
  .host-badge {
    width: 12vw;
  }
}

</style>