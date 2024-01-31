<template>
  <div :key="profile?.id" :class="`number-${index}-trophy`"
    class="col-12 score-card d-flex gap-3 justify-content-between align-items-center p-2 border">

    <div class="d-flex gap-3 align-items-center">
      <span class="fs-5">{{ index }}.</span>
      <router-link :to="{ name: 'Profile.overview', params: { profileId: profile.id } }">
        <ProfileImg :profile="profile" />
      </router-link>
      <span class="">{{ profile.nickname || profile.name }}</span>
    </div>
    <div>
      <span class="text-center text-uppercase">{{ board.prop }} {{ profile[board.prop] }}</span>
      <span class="text-end text-capitalize" v-if="profile.title">Title: {{
        profile.title
      }}</span>
    </div>
  </div>
</template>

<script>
import { Profile } from "../../models/Profile.js";

export default {
  props: {
    profile: {
      type: Profile,
      required: true,
    },
    index: {
      type: Number,
      required: true,
      default: 0
    },
    board: {
      type: Object,
      required: true
    }
  },
}
</script>

<style scoped lang="scss">
#number-1-player>.number-1-trophy {
  &:after {
    content: '';
    position: absolute;
    top: 6px;
    left: 2px;
    width: 100%;
    height: 75%;
    font-size: 2rem;
    padding: 0 0px;
    background-image: url('../../assets/img/gold.png');
    background-repeat: no-repeat;
    background-size: contain;
    filter: brightness(1.25);
    text-shadow: 2px 2px 2px var(--border-dark);
    opacity: 1;
  }
}

#number-2-player>.number-2-trophy {
  &:after {
    content: '';
    position: absolute;
    top: 6px;
    left: 2px;
    width: 100%;
    height: 75%;
    font-size: 2rem;
    padding: 0 0px;
    background-image: url('../../assets/img/silver.png');
    background-repeat: no-repeat;
    background-size: contain;
    text-shadow: 2px 2px 2px var(--border-dark);
    opacity: 1;
  }
}

#number-3-player>.number-3-trophy {
  &:after {
    content: '';
    position: absolute;
    top: 6px;
    left: 2px;
    width: 100%;
    height: 75%;
    font-size: 2rem;
    padding: 0 0px;
    background-image: url('../../assets/img/bronze.png');
    background-repeat: no-repeat;
    background-size: contain;
    text-shadow: 2px 2px 2px var(--border-dark);
    opacity: 1;
  }
}

.score-card {
  position: relative;
  opacity: .85;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 1px);
    background: #00000050;
  }

  .profile-picture {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    border: 1px solid var(--border-dark);
    aspect-ratio: 1/1;
  }

  span {
    display: inline-block;
    color: var(--text-main) !important;
    text-shadow: 2px 2px 2px var(--border-dark);
    z-index: 1;
  }
}
</style>