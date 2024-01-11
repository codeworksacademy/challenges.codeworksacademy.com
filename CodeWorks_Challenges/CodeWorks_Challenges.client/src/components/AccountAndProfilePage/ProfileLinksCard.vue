<template>
  <div class="my-3 mx-1 px-3 py-2 user-links-card rounded d-flex flex-column">
    <p class="text-white-50">
      User Links
    </p>
    <div class="text-white d-flex flex-column">
      <div class="user-links-btn rounded">
        <router-link :to="{ name: 'Profile.overview' }">
          <button class="btn text-white link-btn">
            <i class="mdi mdi-layers"></i> Overview
          </button>
        </router-link>
      </div>
      <div class="user-links-btn rounded">
        <router-link :to="{ name: 'Profile.challenges' }">
          <button class="btn text-white link-btn">
            <i class="mdi mdi-file-code"></i> Challenges
          </button>
        </router-link>
      </div>
      <div class="user-links-btn rounded">
        <router-link :to="{ name: 'Profile.badges' }">
          <button class="btn text-white link-btn">
            <i class="mdi mdi-seal"></i> Badges
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
  background-color: #0E141E;
}

.user-links-btn:hover {
  background-color: #0B0E13;
}

.link-btn:focus {
  border: 1px solid #0B0E13;
}
</style>