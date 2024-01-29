<template>
  <div class="avatar-container col-lg-3 col-5">
    <div class="avatar-bg"></div>
    <img :src="profile.picture" :alt="profile.name" class="avatar-lg mx-4 light-gold-border avatar-style">
  </div>
  <div class="d-flex flex-column col-lg-9 col-7">
    <p class="fs-2 m-0">
      {{ profile.name }}
    </p>
    <p class="fs-5 hide-sm">
      <span class="light-gold-color">Rank: </span> {{ rankTitle }}
      <span title="experience" class="ms-4">
        {{ profile.rank }} <span class="light-gold-color">XP</span>
      </span>
      <span title="challenges" class="ms-4">
        {{ challenges.length }}
        <i class="mdi mdi-file-code light-gold-color"></i>
      </span>
      <span title="milestones" class="ms-4">
        {{ milestones.length }}
        <i class="mdi mdi-trophy light-gold-color"></i>
      </span>
      <span title="badges" class="ms-4">
        {{ badges.length }}
        <i class="mdi mdi-seal light-gold-color"></i>
      </span>
      <span title="reputation" class="ms-4">
        {{ profile.reputation }} <i class="mdi light-gold-color mdi-emoticon-happy"></i>
      </span>
    </p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { Profile } from '../../models/Profile.js'
import { Account } from '../../models/Account.js'
import { RANK_BADGE } from '../../constants'

export default {
  props: {
    profile: { type: [Profile, Account], required: true },
    challenges: { type: Array, required: true },
    participation: { type: Array, required: true },
    milestones: { type: Array, required: true },
  },

  setup(props) {
    return {
      badges: computed(() => props.participation.filter(p => p.status == 'completed')),
      rankTitle: computed(() => {
      let lastKey = 0
      for (const badge of RANK_BADGE) {
        if (props.profile.rank >= badge.RANK_THRESHOLD) {
          lastKey = badge.RANK_THRESHOLD
        }
      }
      return RANK_BADGE.find(badge => badge.RANK_THRESHOLD === lastKey).NAME
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-container {
  position: relative;
  top: -5.5vh;
}

.avatar-style {
  position: absolute;
}

.avatar-bg {
  position: absolute;
  background-color: #0E131B;
  top: 0;
  left: 24px;
  height: 7rem;
  width: 7rem;
  border-radius: 50%;
}

@media(max-width: 768px) {
  .avatar-lg {
    height: 5.5rem;
    width: 5.5rem;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
  }

  .avatar-bg {
    position: absolute;
    background-color: #0E131B;
    top: 0;
    left: 24px;
    height: 5.5rem;
    width: 5.5rem;
    border-radius: 50%;
  }
}

@media(max-width: 391px) {
  .hide-sm {
    display: none;
  }
}
</style>
