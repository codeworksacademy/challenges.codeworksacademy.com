<template>
  <div :key="profile?.id" class="col-12 score-card d-flex gap-3 justify-content-between align-items-center p-2 border">

    <div class="d-flex gap-3 align-items-center">
      <span class="rank">{{ index }}.</span>
      <img class="trophy" v-if="index <= 3" :src="loadTrophy()" />
      <router-link :to="{ name: 'Profile.overview', params: { profileId: profile.id } }">
        <ProfileImg :profile="profile" />
      </router-link>
      <span class="">{{ profile.nickname || profile.name }}</span>
    </div>
    <div class="d-flex gap-3 align-items-center">
      <span class="text-center text-uppercase">{{ board.prop }} {{ profile[board.prop] }}</span>
      <ProfileTitle :title="profile.title" />
    </div>
  </div>
</template>

<script>
import { Profile } from "../../models/Profile.js";
import gold from '../../assets/img/trophy-1.png'
import silver from '../../assets/img/trophy-2.png'
import bronze from '../../assets/img/trophy-3.png'
import ProfileTitle from "../ProfileTitle.vue";


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
  setup(props) {
    return {
      loadTrophy() {
        switch (props.index) {
          case 1:
            return gold;
          case 2:
            return silver;
          case 3:
            return bronze;
        }
      }
    };
  },
  components: { ProfileTitle }
}
</script>

<style scoped lang="scss">
.trophy {
  height: 1em;
}

.score-card {
  position: relative;
  opacity: .85;

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