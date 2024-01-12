<template>
  <div :class="`card-hover ${themeStyle ? 'theme-style' : ''} rounded-3 m-auto mt-3`" :style="{ backgroundColor: bgColor, border: `2px groove ${color}` }" style="filter: brightness(.9);">
    <div class="card-hover__content">
      <h3 class="card-hover__title">
        Alert! New <span> Badge </span> available!
      </h3>
      <div class="backdrop"></div>
      <p class="card-hover__text"> Hover for Preview </p>
      <div class="text-center" style="text-shadow: 2px 2px 2px #000000;">
        <div class="card-hover__link">

          <!-- SECTION - ADD AN '@click' TO ENABLE OFFCANVAS DETAILS CARD (OPENS THE OFFCANVAS) ------------------------------>
          <span id="offcanvas-button" class="my-link offcanvas-button" type="button"  aria-controls="detailsOffcanvas">Details</span>
          <svg fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="#281704">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </div>

    <div class="card-hover__extra">
      <h5 class="mt-4"><span>Craving </span> "Item" <span> today?</span> </h5>
    </div>
    <div class="enlarge-badge">
      <span><ChallengeBadge :challenge="challenge" /></span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../../AppState'
import { Challenge } from '../../models/Challenge'
import ChallengeBadge from './ChallengeBadge.vue'

export default {
props: {
  challenge: {
    type: Challenge || Object,
    required: true
  },
  bgColor: { type: String, required: false, default: '#323e78' },
  color: { type: String, required: false, default: '#323e7829' },
  themeStyle: { type: Boolean, required: false, default: false }
},
setup(props) {
    return {
      challengeHasBadge: computed(() => AppState.challenges.filter(c => c.badge !== null)),
      isPublished: computed(() => props.challenge.status === 'published')
    }
  },
  components: {
    ChallengeBadge
  }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;600&display=swap');

$firaSans: 'Fira Sans', sans-serif;

h1,
h2,
h3,
h4,
h5 {
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 0;
}
.card-hover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  max-height: 350px;
  color: #1F1D42;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    
    
  }
}
.offcanvas-xxl {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 75% !important;
  right: 0 !important;
  left: 0 !important;
  margin: auto !important;
}
.card-hover__content {
  padding-top: 125px !important;
}
.card-hover:hover {
  filter: brightness(1.1)
}
.card-hover {
  $root: &;
  width: 350px;
  height: 250px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 32px -10px rgba(0,0,0,0.08);

  &:has(#{$root}__link:hover) {
    #{$root}__extra {
      transform: translateY(0);
      transition: transform 0.25s;
    }
  }
  &:hover {
    #{$root} {

      &__content {
        background-color: var(--shadow-purple);
        filter: drop-shadow(15px 15px 5px var(--shadow-blue));
        bottom: 100%;
        transform: translateY(225%);
        padding: 25px 30px;
        transition: all 0.25s cubic-bezier(.1,.72,.4,.97);
        z-index: 2;
        opacity: .9;
      }
      &__link {
        bottom: -15rem;
        opacity: 1;
        transform: translate(-50%, 0);
        transition: all 0.3s 0.25s cubic-bezier(.1,.72,.4,.97);
      }
    }
    .enlarge-badge:active {
      transform: scale(1.1);
      transition: 0.25s 0.1s transform cubic-bezier(.1,.72,.4,.97);
    }
  }
  &__content {
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #212d49;
    text-shadow: 1px 1px 2px var(--text-sub);
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(0);
    transition: all 0.25s 0.25s cubic-bezier(.1,.72,.4,.97);
    will-change: bottom, background-color, transform, padding;
    z-index: 1;
    .backdrop {
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content:flex-start;
      background-image: url('../../assets/img/codeworks-logo.svg');
      background-position: top;
      background-size: cover;
      transform: translate(30%, -25%);
    }
    &::before,
    &::after {
      content: '';
      width: 100%;
      height: 80px;
      background-color: inherit;
      position: absolute;
      left: 0;
      z-index: -1;
    }
    &::before {
      top: -35px;
      clip-path: ellipse(60% 80px at bottom center);
    }
    &::after {
      bottom: -80px;
      clip-path: ellipse(60% 80px at top center);
    }
  }
  &__title {
    font-size: 1.25rem;
    margin-top: -1.5em;
    color: var(--text-main);
    text-shadow: 3px 3px 5px  var(--border-main);
    span {
      color: var(--shadow-green);
      text-shadow: 3px 3px 5px  var(--shadow-blue);
    }
  }
  &__text {
    color: var(--shadow-green);
    text-shadow: 3px 3px 5px  var(--text-sub);
    font-size: 0.75rem;
    filter: brightness(1.15);
  }
  &__link {
    font-size: 1.25rem;
    font-weight: 700;
    position: absolute;
    bottom: -14.5rem;
    left: 50%;
    transform: translate(-50%, 10%);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-decoration: none;
    color: var(--shadow-blue);
    text-shadow: 2px 2px 2px #000000;
    background-color: 0 0 0 2px #000000;
    opacity: 0;
    padding: 10px;
    transition: all 0.25s;   
    &:hover {
      svg {
        transform: translateX(10px);
      }
    }
    svg {
      width: 18px;
      margin-left: 4px;
      transition: transform 0.3s;
    }
  }
  &__extra {
    height: 50%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    font-size: 1.4rem;
    text-align: center;
    background-color: #fffdcb9b;
    padding: 40px;
    bottom: 0;
    color: var(--text-main);
    text-shadow: 2px 2px 3px #ffffff;
    transform: translateY(100%);
    will-change: transform;
    transition: transform 0.25s;
    z-index: 1;
    span {
      color: var(--text-main);
      text-shadow: 2px 2px 2px var(--shadow-blue);
    }
  }
  .my-link:hover {
    color: var(--text-main) !important;
    text-shadow: 2px 2px 3px var(--shadow-blue) !important;
    transition: all 0.25s;
  }
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: scale(1.2);
    transition: 0.25s 0.25s transform cubic-bezier(.1,.72,.4,.97);
    opacity: 1;
  }
}
.enlarge-badge {
  position: absolute;
  top: -60%;
  width: 100%;
  height: 100%;
  transform: scale(2) translateY(53%);
  transition: 0.25s 0.25s transform cubic-bezier(.1,.72,.4,.97);
  opacity: 1;

}
.offcanvas-button {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  text-shadow: 2px 2px 2px black;
  transition: all 0.25s;
}
</style>