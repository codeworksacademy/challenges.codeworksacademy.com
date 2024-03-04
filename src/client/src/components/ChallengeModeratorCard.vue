<template>
  <section class="container-fluid mb-4 mb-md-5" v-if="moderator.profile?.id" :key="moderator.id">
    <div class="card card-custom" :class="isOwner ? 'border-white' : ''" :title="isOwner ? 'Challenge Creator' : ''">
      <div class="card-custom-img" :style="`background-image: url(${moderator.profile.picture});`"></div>
      <router-link :to="{ name: 'Profile.overview', params: { profileId: moderator.profile.id } }">
        <p class="btn bg-dark btn-success text-success mod-profile-button">Visit Profile</p>
      </router-link>
      <div class="card-body">
        <h6 class="card-title pt-2 d-flex flex-wrap">
          <span class="me-auto">Name: {{ moderator.profile.nickname || moderator.profile.name }}</span>
          <span class="">Status: {{ moderator.status }}</span>
        </h6>
        <p class="card-text" v-if="moderator.profile?.bio">
          <span class="fw-bold">Bio: </span>{{ moderator.profile.bio }}
        </p>
      </div>
      <div class="card-footer">
        <p class="card-text">
          User Signup Date: {{
            new Date(moderator.createdAt)
              .toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) }}
          @ {{
            new Date(moderator.createdAt)
              .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric'
              }) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from "vue";
import { ChallengeModerator } from "../models/ChallengeModerator.js";
import { AppState } from "../AppState.js";

export default {
  props: {
    moderator: {
      type: ChallengeModerator || Object,
      required: true
    }
  },
  setup(props) {
    return {
      isOwner: computed(() => props.moderator.accountId == AppState.ChallengeState.challenge?.creatorId)
    }
  }
}
</script>

<style scoped lang="scss">
.card-body {
  overflow-y: auto;
  height: 11.8rem;
}

.card-footer {
  height: 2.2rem;
  border-color: inherit;
  font-weight: 400;
  font-size: .6rem;
}

.card-custom {
  color: #efefef;
  text-shadow: 0 1px 5px #998ce2;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  background-color: #0a0b14f3;
  box-shadow: 0 0 15px 2px #0a0a0a4d;
  transition: .5 ease-in-out;
  overflow-y: auto;
  max-height: 24rem;
  transition: .5s ease-in-out;
}

.card-custom-img {
  height: 14rem;
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
  top: 9.5rem;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-top-width: 40px;
  border-right-width: 0;
  border-bottom-width: 0;
  border-left-width: 545px;
  border-left-width: calc(575px - 5vw);
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: #0b0c15b9;
}

.mod-profile-button {
  padding: .25rem;
  text-align: center;
  background-color: gold;
  font-size: .9rem;
  color: aliceblue;
  text-shadow: 1px 1px 3px #000000;
  border-radius: .5rem;
  position: absolute;
  top: .5rem;
  right: .5rem;
  background-image: linear-gradient(linear, left top, right top, color-stop(0%, #1e0a0a00), color-stop(25%, #1e0a0a00), color-stop(60%, #726e50d9), color-stop(100%, #1e0a0a00));
  background-image: linear-gradient(120deg, #1e0a0a00 0%, #1e0a0a00 25%, #726e50d9 60%, #1e0a0a00 100%);
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

.card-custom:hover {
  filter: brightness(1.1);
}

::-webkit-scrollbar {
  width: 10px;
  background-color: var(--bg-main);
}

::-webkit-scrollbar-thumb {
  background-color: var(--bg-sub);
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background-color: var(--bg-main);
}

::-webkit-scrollbar-corner {
  background-color: var(--bg-main);
}

::-webkit-scrollbar-button {
  background: transparent;
  border-radius: 5px;
  height: 5px;
}

@media screen and (max-width: 768px) {
  .mod-profile-button {
    width: 13vw;
  }
}
</style>