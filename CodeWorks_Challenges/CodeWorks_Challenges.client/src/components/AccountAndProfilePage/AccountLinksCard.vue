<template>
  <div class="my-3 mx-1 px-3 py-2 user-links-card rounded d-flex flex-column">
    <p class="text-white-50">
      User Links
    </p>
    <div class="text-white d-flex flex-column">
      <div class="user-links-btn hover-green rounded-1 selectable">
        <router-link :to="{name: 'Account.overview'}">
          <button class="btn text-white link-btn">
            <i class="mdi mdi-layers text-green"></i> Overview
          </button>
        </router-link>
      </div>
      <div class="user-links-btn hover-orange rounded-1 selectable">
        <router-link :to="{name: 'Account.challenges'}">
          <button class="btn text-white link-btn">
            <i class="mdi mdi-file-code text-orange"></i> Challenges
          </button>
        </router-link>
      </div>
      <div class="user-links-btn hover-purple rounded-1 selectable">
        <router-link :to="{name: 'Account.moderations'}">
          <button class="btn text-white link-btn">
            <i class="mdi mdi-account-star text-purple"></i> Moderations
          </button>
        </router-link>
      </div>
      <div class="user-links-btn hover-blue rounded-1 selectable">
        <router-link :to="{name: 'Account.badges'}">
          <button class="btn text-white link-btn">
            <i class="mdi mdi-seal text-blue"></i> Badges
          </button>
        </router-link>
      </div>
      <div class="user-links-btn hover-warning rounded-1 selectable">
        <router-link :to="{name: 'Account.milestones'}">
          <button class="btn text-white link-btn">
            <i class="mdi mdi-trophy text-yellow"></i> Milestones
          </button>
        </router-link>
      </div>
    </div>
    <div class="border-overline">
      <div class="user-links-btn rounded-1">
        <button class="btn text-white link-btn" data-bs-toggle="modal" data-bs-target="#accountFormModal">
          <i class="mdi mdi-account-edit"></i> Edit Account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  setup(){
    const route = useRoute()

    return {
      route
    }
  }
}
</script>


<style lang="scss" scoped>
@import url('../../assets/scss/_root.scss');
.user-links-card{
  background-color: #0E141E;
}
.user-links-btn:hover{
  background-color: #0B0E13;
}
.link-btn:focus{
  border: 1px solid #0E141E;
}
.border-overline{
  border-top: 1px solid #797A7A;
  border-radius: 0px;
}
</style>