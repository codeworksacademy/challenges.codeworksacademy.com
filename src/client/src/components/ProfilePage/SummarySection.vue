<template>
  <div class="container-fluid">
    <section class="row">
      <div class="avatar-container col-4 col-sm-2 p-0">
        <div class="avatar-bg"></div>
        <ProfileImg :profile="profile" class="avatar-lg mx-4 light-gold-border avatar-style" />
      </div>

      <div class="d-flex flex-column col-8 col-sm-10">
        <p class="fs-2 hide-sm m-0">
          {{ profile.nickname || profile.name }}
        </p>
        <p class="fs-5 hide-sm">
          <span class="light-gold-color">Rank: </span> {{ rankTitle }}
          <span title="experience" class="ms-4">
            {{ profile.rank }} <span class="light-gold-color">XP</span>
          </span>
          <span title="challenges" class="ms-4">
            {{ summary.challenges }}
            <i class="mdi mdi-file-code light-gold-color"></i>
          </span>
          <span title="milestones" class="ms-4">
            {{ summary.milestones }}
            <i class="mdi mdi-trophy light-gold-color"></i>
          </span>
          <span title="badges" class="ms-4">
            {{ summary.badges }}
            <i class="mdi mdi-seal light-gold-color"></i>
          </span>
          <span title="reputation" class="ms-4">
            {{ profile.reputation }} <i class="mdi light-gold-color mdi-emoticon-happy"></i>
          </span>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'
import { Profile } from '../../models/Profile.js'
import { Account } from '../../models/Account.js'
import { RANK_TITLE } from '../../constants'
import ProfileImg from "../ProfileImg.vue"

export default {
  components: { ProfileImg },
  props: {
    profile: { type: [Profile, Account], required: true },
    summary: {
      challenges: { type: Number },
      milestones: { type: Number },
      badges: { type: Number },
    },
  },
  setup(props) {
    return {
      badges: computed(() => props.participation.filter(p => p.status == 'completed')),
      rankTitle: computed(() => {
        let lastKey = 0;
        for (const badge of RANK_TITLE) {
          if (props.profile.rank >= badge.RANK_THRESHOLD) {
            lastKey = badge.RANK_THRESHOLD;
          }
        }
        return RANK_TITLE.find(badge => badge.RANK_THRESHOLD === lastKey).NAME;
      })
    };
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
