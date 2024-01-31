<template>
  <div class="my-3 mx-1 px-3 py-2 user-links-card rounded d-flex flex-column">
    <h4 class="text-white-50">
      User Links
    </h4>
    <div class="d-flex flex-column">
      <div class="user-links-btn hover-green rounded selectable">
        <router-link :to="{ name: 'Profile.overview' }">
          <button class="btn link-btn">
            <i class="mdi mdi-layers text-green"></i> Overview
          </button>
        </router-link>
      </div>
      <div class="user-links-btn hover-orange rounded selectable">
        <router-link :to="{ name: 'Profile.challenges' }">
          <button class="btn link-btn">
            <i class="mdi mdi-file-code text-orange"></i> Challenges
          </button>
        </router-link>
      </div>
      <div class="user-links-btn hover-blue rounded selectable">
        <router-link :to="{ name: 'Profile.badges' }">
          <button class="btn link-btn">
            <i class="mdi mdi-seal text-blue"></i> Badges
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute()

    return {
      route
    }
  }
}
</script>

<style lang="scss" scoped>
.user-links-card {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}

.user-links-btn:hover {
  background-color: #0B0E13;
}

.link-btn:focus {
  border: 1px solid #0B0E13;
}
</style>