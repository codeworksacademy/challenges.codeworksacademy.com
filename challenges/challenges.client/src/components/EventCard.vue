<template>
    <section v-if="event" :key="event?.id" class="container-fluid">
        <div class="row container">
          <div class="box col-6" :style="{ '--box-background-image': `url(${event.coverImg})` }">
            <span></span>
            <div class="content">
              <h2> {{ event.name }} </h2>
              <div class="description-box">
                <p class="py-2"> {{ truncatedDescription }} </p>
              </div>
              <a class="btn btn-outline-primary" href="#">Read More</a>
            </div>
          </div>
        </div>
    </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { eventsService } from "../services/EventsService.js"
import { Event } from '../models/Event.js'

export default {
  props: {
    event: {
      type: Event || Object,
      required: true
    }
  },
  setup(props) {
    
    onMounted(() => {

    })
    return {
      events: computed(() => AppState.events),
      activeEvent: computed(() => AppState.activeEvent),

      truncatedDescription: computed(() => {
        return props.event.description.split(' ').splice(0, 24).join(' ') + '...'
      }),

      setActiveEvent(eventId) {
        try {
          eventsService.setActiveEvent(eventId)
          logger.log('active event', AppState.activeEvent)
        } catch (error) {
          logger.error(error)
          Pop.toast(error, 'error')
        }
      }
    }
  }
}
</script>
  
<style scoped lang="scss">
@import '../assets/scss/_variables.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: consolas;
}

.container-fluid {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 40px 0;
}

.container .box {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 30px;
  transition: all 0.5s ease-in-out;

    &:hover {
      position: relative;
      margin-right: -75px;
    }
}

.container .box::before {
  content:' ';
  position: absolute;
  top: 0;
  left: 50px;
  width: 50%;
  height: 100%;
  text-decoration: none;
  background: #FFF;
  border-radius: 8px;
  transform: skewX(15deg);
  transition: all 0.5s ease-in-out;
}

.container .box[data-v-f2df5c1a]:hover::after {
  background: #00000080;
  transition: all 0.5s ease-in-out;
}

.container .box::after {
  content:'';
  position: absolute;
  top: 0;
  left: 50;
  width: 75%;
  height: 100%;
  background: #F0F0F0;
  border-radius: 8px;
  transform: skewX(15deg);
  transition: 0.5s;
  filter: blur(40px);
}

.container .box:hover:before,
.container .box:hover:after {
  transform: skewX(0deg);
  position: absolute;
  top: -20px;
  left: -90px;
  min-width: 400px;
  min-height: 450px;
}

.container .box:nth-child(1):before,
.container .box:nth-child(1):after {
  background-image: var(--box-background-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.container .box:nth-child(2):before,
.container .box:nth-child(2):after {
  background: linear-gradient(315deg, var(--primary-blue), var(--secondary-magenta));
  transition: 0.5s;
}

.container .box:nth-child(3):before,
.container .box:nth-child(3):after {
  background: linear-gradient(315deg, var(--primary-green), var(--primary-blue));
  transition: 0.5s; 
}

.container .box span {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  pointer-events: none;
}

.container .box span::before {
  content:'';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-radius: 8px;
  background: #38BB6433;
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: 0.1s;
  animation: animate 2s ease-in-out infinite;
  box-shadow: 0 5px 15px #00000014;
}

.container .box:hover span::before {
  top: -50px;
  left: 50px;
  width: 100px;
  height: 100px;
  opacity: 1;
}

.container .box span::after {
  content:'';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #388FBB33;
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: 0.5s;
  animation: animate 2s ease-in-out infinite;
  box-shadow: 0 5px 15px #00000014;
  animation-delay: -1s;
}

.container .box:hover span:after {
  bottom: -50px;
  right: 50px;
  width: 100px;
  height: 100px;
  opacity: 1;
}

@keyframes animate {
  0%, 100% {
    transform: translateY(10px);
  }
  
  50% {
    transform: translate(-10px);
  }
}

.container .box .content {
  position: relative;
  top: 7.5px;
  left: 0;
  padding: 20px 40px;
  background: #FFFFFF0D;
  color: var(--text-primary);
  text-shadow: 0px 1px var(--primary-green);
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 15px #0000001A;
  border-radius: 8px;
  border-top: 3px double #FFFFFF66;
  border-left: 3px double #FFFFFF66;
  z-index: 1;
  transform: .5s;
    h2 {
      color: var(--text-primary);
    }
    >a {
      text-shadow: none;
    }
    &:hover {
      height: 375px;
      margin-left: 10px;
      background: #000000AB !important;
      border-top: 3px solid #388FBB44 !important;
      border-left: 3px solid #BB643844   !important;
      border-right: 3px solid #38BB6444 !important;
      border-bottom: 3px solid #BB388F44 !important;
    }
}

.container .box:hover .content {
  background: #00000080;
  left: -10px;
  padding: 60px 40px;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  background-image: linear-gradient(180deg, var(--primary-blue), var(--primary-green));
  border: none;
  transition: 0.5s;
  filter: brightness(.85);
  text-shadow: 0px 1.25px #ffffff88;
  z-index: 2;
}

.container .box .content h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.box:hover {
  color: var(--text-primary);
  filter: brightness(1.5);
  text-shadow: 0px 1px #ffffff88;
  background-clip: border-box;
  transition: 0.5s;
}

.box:hover {
  width: 100%;

    :before {
      left: 500px;
      padding: 20px 40px;
    }
}

.container .box .content p {
  font-size: 1.1em;
  margin-bottom: 10px;
  line-height: 1.4em;
}

.container .box .content a.btn-outline-primary {
  display: inline-block;
  position: relative;
  font-size: 1.1em;
  color: #111;
  padding: 10px;
  border-color: #F0F0F074;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 5px;
  background: #1e3d20;
  z-index: 1;
  font-size: .85rem;
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: 1px 1px 2px #0F0F0F;
  transition: .5s ease-in-out;

    &:hover::after {
      content: '';
      display: inline-block;
      position: absolute;
      font-size: 1.1em;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 4px;
      text-decoration: none;
      margin-top: 5px;
      width: 100%;
      height: 100%;
      background: #00000080;
      box-shadow: 0 0 15px 2px #0a0a0a4d;
      backdrop-filter: brightness(10%);
      color: var(--text-primary);
      box-shadow: 0 0 15px 2px #BB388FFF;
      border: none;
      transition: .5s ease-in-out;
    }
}

.container .box .content:hover::after {
  background: #00000080;
  border-top: 1px solid #388FBBAA;
  border-bottom: 1px solid #BB388FAA;
  border-left: 1px solid #BB6438AA;
  border-right: 1px solid #38BB64AA;
  box-shadow: 0 1px 15px #01010133;
}

.container .box .content a.btn-outline-primary:hover {
  content: '';
}
.container .box .content a.btn-outline-primary:hover::after {
  content: 'Click Me';
  display: inline-block;
  position: absolute;
  top: -4px;
  left: 0;
  width: inherit;
  height: 100%;
  box-sizing: border-box;
  font-size: .9em;
  border: none;
  border-radius: inherit;
  box-shadow: 0 0 15px 2px #0a0a0a4d;
  backdrop-filter: brightness(10%);
  color: var(--text-primary);
  box-shadow: 0 0 15px 2px #BB388FFF;
  transition: .5s ease-in-out;
  padding: inherit;
}

.container .box .content a:hover {
  background: #00000080;
  border: 1px solid #FF005866;
  box-shadow: 0 1px 15px #01010133;
}

.container .box:hover::after,
.container .box:hover:before,
.container .box:hover:after {
  transform: skewX(0deg);
  width: calc(100% - 15px);
  opacity: 0.6;
  filter: blur(0);
  z-index: 1;
  transition: 0.5s;
}

@media screen and (max-width: 768px) {
  .container {
    display: flex;
    flex-direction: row;
    justify-content: left !important;
    align-items: center;
    margin-left: 25%;

      &:hover {
        position: relative;
        margin-right: -75px;
      }
  }

  .container .box .content[data-v-f2df5c1a] {
    width: 300px;
  }
}
</style>