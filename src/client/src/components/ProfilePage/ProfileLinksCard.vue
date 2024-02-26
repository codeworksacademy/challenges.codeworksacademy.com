<template>
  <div class="mt-3 ms-0 ms-md-2 px-3 py-2 user-links-card rounded-3 d-flex flex-column">

    <p class="text-white-50 mb-2"> User Links </p>

    <div class="text-white d-flex flex-column mb-2 gap-1">
      <div class="user-links-btn hover-green rounded-2 selectable my-0 my-md-1">
        <router-link :to="{ name: 'Profile.overview' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-3">
          <i class="text-primary mx-1 fs-5 mdi mdi-layers text-green"></i>
          <span class="text-white mx-2">Overview</span>
        </router-link>
      </div>
      <div class="user-links-btn hover-orange rounded-1 selectable my-1">
        <router-link :to="{ name: 'Profile.challenges' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-3">
          <i class="text-primary mx-1 fs-5 mdi mdi-file-code text-orange"></i>
          <span class="text-white mx-2">Challenges</span>
        </router-link>
      </div>
      <div class="user-links-btn hover-blue rounded-1 selectable my-1">
        <router-link :to="{ name: 'Profile.badges' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-3">
          <i class="text-primary mx-1 fs-5 mdi mdi-seal text-blue"></i>
          <span class="text-white mx-2">Badges</span>
        </router-link>
      </div>
      
      <dev-flag>
      <div class="user-links-btn hover-warning rounded-1 selectable my-1">
        <router-link :to="{ name: 'Profile.milestones' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-3">
          <i class="text-primary mx-1 fs-5 mdi mdi-trophy text-yellow"></i>
          <span class="text-white mx-2">Milestones</span>
        </router-link>
      </div>
      </dev-flag>

      <div class="user-links-btn hover-purple rounded-1 selectable my-1" v-if="isMyProfile">
        <router-link :to="{ name: 'Profile.moderations' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-3">
          <i class="text-primary mx-1 fs-5 mdi mdi-account-star text-purple"></i>
          <span class="text-white mx-2">Moderations</span>
        </router-link>
      </div>
    </div>
    <div class="user-links-btn rounded-1 btn border-overline mt-1 py-2" v-if="isMyProfile">
      <a class="d-flex align-items-center p-1" target="_blank" href="https://codeworksacademy.com/#/account/settings">
        <i class="text-primary mx-1 fs-5 mdi mdi-account-edit"></i>
        <span class="text-white mx-2 mx-2">Edit Account</span>
        <i class="mdi mdi-open-in-new"></i>
      </a>
    </div>
  </div>
</template>


<script>
import { computed } from "vue";
import { useRoute } from 'vue-router';
import { AppState } from "../../AppState.js";
import DevFlag from "../DevFlag.vue";

export default {
    setup() {
        const route = useRoute();
        return {
            route,
            isMyProfile: computed(() => route.params.profileId == AppState.AccountState.account.id),
        };
    },
    components: { DevFlag }
}
</script>


<style lang="scss" scoped>
.router-link-exact-active {
  border-left: 2px solid #00CCE6;
  border-right: 2px solid #00CCE6;
  border-radius: .5rem;
}

.user-links-card {
  background-color: #0E141E;
  border: 1px solid #2d386b;
}

.border-overline {
  border: 1px solid #0E141E;
  border-top: 1px solid #797A7A;
}
</style>