<template>
  <div class="container-fluid gap-3 p-2 border">
    <section class="row score-card">
      <div class="col-12 d-flex flex-wrap justify-content-between">
        <div class="d-flex gap-3 align-items-center me-3">
          <span>{{ index }}.</span>
          <img class="trophy" v-if="index <= 3" :src="loadTrophy()" />
          <router-link :to="{ name: 'Profile.overview', params: { profileId: profile.id } }">
            <ProfileImg :profile="profile" />
          </router-link>
          <span>{{ profile.nickname || profile.name }}</span>
        </div>
        <div class="d-flex gap-3 align-items-center ms-2">
          <span class="text-center text-uppercase">{{ board.prop }} {{ profile[board.prop] }}</span>
          <ProfileTitle :titleName="profile.title" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Profile } from "../../models/Profile.js";
import gold from '../../assets/img/trophy-1.png'
import silver from '../../assets/img/trophy-2.png'
import bronze from '../../assets/img/trophy-3.png'
import ProfileTitle from "../ProfileTitle.vue";
import ProfileImg from "../ProfileImg.vue";


export default {
  props: {
    profile: { type: Profile, required: true, },
    index: { type: Number, required: true, default: 0 },
    board: { type: Object, required: true }
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
  components: { ProfileTitle, ProfileImg }
}
</script>

<style scoped lang="scss">
.trophy {
  height: 2em;
}
</style>