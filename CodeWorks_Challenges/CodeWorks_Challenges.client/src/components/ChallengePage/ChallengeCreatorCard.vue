<template>
  <section class="creator-details-card rounded text-capitalize p-2 rounded-3"
    :style="{ backgroundColor: bgColor, borderColor: color, backgroundImage: `url(${profile.coverImg})`, backgroundPosition: 'center', backgroundSize: 'cover' }">
    <div class="p-2">
      <div class="d-flex align-items-center">
        <router-link :to="{ name: 'Profile.overview', params: { profileId: profile.id } }">
          <img :src="profile.picture" :alt="`Image for Challenge creator named '${profile.name}' is broken`"
            :title="`Image of the Challenge Creator ${profile.name}`" class="creator-img img-fluid rounded-circle"
            style="height: 55px; width: 55px;" @error="(e) => e.target.src = 'https://codeworks.blob.core.windows.net/public/assets/img/anonymous.jpg'">
        </router-link>

        <div class="ms-3 text-start">
          <sub class="creator-text text-uppercase badge p-0 text-warning" v-if="profile.title">{{ profile.title }}</sub>
          <p class="creator-text text-capitalize fs-3 mb-0">{{ profile.name }}
          </p>
          <div class="d-flex flex-wrap gap-3 fw-semibold">
            <span class="creator-text text-capitalize"><i class="mdi mdi-account-star me-2"></i>{{ profile.reputation
            }}</span>
            <span class="creator-text text-capitalize">{{ profile.experience }} XP</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Challenge } from '../../models/Challenge'
import { Profile } from '../../models/Profile.js'

export default {
  props: {
    challenge: {
      type: [Challenge, Object],
      required: true
    },
    profile: {
      type: [Profile, Object],
      required: true
    },
    bgColor: { type: String, required: true },
    color: { type: String, required: true },
  },
  setup() {

    return {
    }
  }
}
</script>

<style scoped lang="scss">
.creator-details-card {
  border-style: groove;
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
  filter: brightness(1);
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

    filter: brightness(1);
    transition: .2s ease-in-out;

    &:hover {
      filter: brightness(1.1);
    }
  }
}
</style>