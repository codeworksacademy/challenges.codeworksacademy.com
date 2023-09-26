<template>
    <section v-if="event" :key="event?.id" class="container-fluid">
      <div class="container">
        <div class="box" :style="{ '--box-background-image': `url(${event.coverImg})` }">
          <span></span>
          <div class="content">
            <h2> {{ event.name }} </h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <a href="#">Read More</a>
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
  setup() {
    
    onMounted(() => {

    })
    return {
      events: computed(() => AppState.events),
      activeEvent: computed(() => AppState.activeEvent),

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
  width: 320px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 30px;
  transition: all 0.5s ease-in-out;
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
  left: 20px;
  width: calc(100% - 90px);
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
  left: 0;
  padding: 20px 40px;
  background: #FFFFFF0D;
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 15px #0000001A;
  border-radius: 8px;
  z-index: 1;
  transform: .5s;
}

.container .box:hover .content {
  background: #00000080;
  left: -10px;
  padding: 60px 40px;
}

.container .box .content h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.box:hover {
  color: var(--text-primary);
  filter: brightness(1.5);
}

.box:hover:before {
  left: 500px;
  padding: 20px 40px;
}

.container .box .content p {
  font-size: 1.1em;
  margin-bottom: 10px;
  line-height: 1.4em;
}

.container .box .content a {
  display: inline-block;
  font-size: 1.1em;
  color: #111;
  background: #F0F0F0;
  padding: 10px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 700;
  margin-top: 5px;
}

.container .box .content a:hover {
  background: #FFCF4d;
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
</style>