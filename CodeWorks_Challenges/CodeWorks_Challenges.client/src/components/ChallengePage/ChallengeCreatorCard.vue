<template>
  <section :class="`creator-details-card ${themeStyle ? 'theme-style' : ''} rounded text-capitalize p-2 rounded-3`"
    :style="{ backgroundColor: bgColor, borderColor: color, borderStyle: 'groove', backgroundImage: `url(${challenge?.creatorCoverImg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }">
    <div class="card-body">
      <div class="col-12 d-flex">
        <div class="col-4 d-flex mb-3">
          <router-link :to="{ name: 'Profile.overview', params: { profileId: challenge.creator.id } }">
            <img :src="challenge.creator.picture"
              :alt="`Image for Challenge creator named '${challenge.creator.name}' is broken`"
              :title="`Image of the Challenge Creator; ${challenge.creator.name}`" class="creator-img img-fluid rounded-circle" style="height: 55px; width: 55px;">
          </router-link>
        </div>
        <div class="col-8 d-flex mt-2 mb-4">
          <span :style="isMobile ? 'padding-left: 4rem;' : 'padding-right: 14rem; white-space: nowrap;'"
            class="creator-text text-capitalize fs-3">Alias: {{ challenge.creator.name }}
          </span>
        </div>
      </div>
      <div class="col-12 d-flex justify-content-around flex-column text-start ps-4 mt-2 ms-2 fw-semibold">
        <span class="creator-text text-capitalize">Challenges Completed: {{ completedChallenges }}</span>
        <span class="creator-text text-capitalize">Experience: {{ challenge.creator.experience }}</span>
        <span class="creator-text text-capitalize">Rank: {{ profile.title }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Challenge } from '../../models/Challenge'
import { AppState } from "../../AppState.js"

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    },
    bgColor: { type: String, required: true },
    color: { type: String, required: true },
    themeStyle: { type: Boolean, required: true, default: false }
  },
  setup() {
    const route = useRoute()
    const isMobile = computed(() => window.innerWidth < 768)

    return {
      route,
      isMobile,
      completedChallenges: computed(() => AppState.ProfileState.participation.filter(p => p.status == 'completed' && p.challenge.creator.id === p.accountId).length),
      profile: computed(() => AppState.ProfileState.participation.filter(p => p.challenge.creator.id === p.profile.id))
    }
  }
}
</script>

<style scoped lang="scss">
.creator-details-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #00000080;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  opacity: .8;
  filter: brightness(1.3);
  z-index: 0;
  color: white;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: .6rem;
    color: white;
    padding: .25rem 0 0 .25rem;
    text-wrap: nowrap;
    background: linear-gradient(-45deg, #00000080 80%, #00000000);
    background-color: invert(#00000000);
    transition: .5s ease-in-out;
    border-radius: 5px;
    z-index: -1;
    >p {
      filter: drop-shadow(0 0 10px 0px #000000);
    }
  }
  .creator-img {
    position: absolute;
    top: 5%;
    left: 5%;
    filter: brightness(.75);
    transition: .2s ease-in-out;
    &:hover {
      filter: brightness(.9);
      transition: .2s ease-in-out;
    }
  }
}
</style>