<template>
  <div class="container-fluid">
    <section class="row justify-content-center align-items-center p-lg-3">
      <div class="col-12 col-lg-6 pt-4 pt-lg-3 d-flex flex-column text-center bgColor border border-light rounded">
        <h1>{{ profile.name }}</h1>
        <p v-if="isMyProfile">{{ profile.email }}</p>
        <p class="mb-0 courier"> Created: </p>
        <p class="mb-0 courier">
          {{ new Date(profile.createdAt).toLocaleDateString() + ' @ ' + new Date(profile.createdAt).toLocaleTimeString() }}</p>
        <div class="fs-1 socials d-flex justify-content-center p-3">
          <a v-if="profile.github" :href="profile.github" target="_blank"><i class="m-3 p-2 mdi mdi-github rounded selectable lighten-30 text-primary" title="github"></i></a>
          <a v-if="profile.linkedin" :href="profile.linkedin" target="_blank"><i class="m-3 p-2 mdi mdi-linkedin rounded selectable lighten-30 text-primary" title="linkedin"></i></a>
          <a v-if="profile.resume" :href="profile.resume" target="_blank"><i class="m-3 p-2 mdi mdi-file-account rounded selectable lighten-30 text-primary" title="resume"></i></a>
          <a v-if="profile.portfolioLink" :href="profile.portfolioLink" target="_blank"><i class="m-3 p-2 mdi mdi-web rounded selectable lighten-30 text-primary" title="portfolio"></i></a>
        </div>
      </div>
      <div class="col-12 col-lg-4 p-2 p-lg-3">
        <p class="pt-3 px-2">{{ profile.bio }}</p>
      </div>
    </section>
  </div>
</template>


<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { AppState } from "../AppState.js";
import { Account } from "../models/Account.js";
import { Profile } from "../models/Profile.js";

export default {
  props: { profile: { type: Profile || Account || Object , required: true} },
  setup() {
    const route = useRoute();
    return {
      isMyProfile: computed(() => { return AppState.AccountState.account?.id == route.params.profileId }),
    }
  }
};
</script>


<style lang="scss" scoped>
.bgColor {
  background-color: #01234569;
  backdrop-filter: blur(5px);
}

.courier {
  font-family: 'Courier New', Courier, monospace;
}
</style>