<template>
  <span class="navbar-text">
    <button class="btn selectable text-success lighten-30 text-uppercase my-2 my-lg-0" v-if="!user.isAuthenticated"
      @click="login">
      Login
    </button>
    <div v-else>
      <div class="dropdown my-1 me-1 ms-2 my-lg-0 p-2">

        <div class="border-0 selectable no-select rounded p-1" type="button" data-bs-toggle="dropdown"
          aria-expanded="false">
          <div class="d-flex align-items-center">
            <div class="me-2">
              <img :src="account.picture || user.picture" alt="account photo" class="avatar-xs light-gold-border" />
            </div>
            <div class="text-white">
              <p class="m-0 fs-5">{{ account.nickname || account.name }}</p>
              <p class="m-0 d-flex gap-2 align-items-center">
                <ProfileTitle :titleName="account.title" />
                <span>
                  {{ account.xp }}
                  <span class="light-gold-color">
                    XP
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="dropdown-menu dropdown-menu-lg-end dropdown-menu-start p-0" aria-labelledby="authDropdown">
          <div class="list-group">
            <router-link :to="{ name: 'Profile.overview', params: { profileId: account.id } }" v-if="account?.title">
              <div class="list-group-item dropdown-item list-group-item-action">
                View Profile
              </div>
            </router-link>
            <div class="list-group-item dropdown-item list-group-item-action text-danger selectable" @click="logout">
              <i class="mdi mdi-logout"></i>
              logout
            </div>
          </div>
        </div>

      </div>
    </div>
  </span>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import { AuthService } from '../services/AuthService'
import ProfileTitle from "./ProfileTitle.vue"

export default {
  setup() {

    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.AccountState.account),
      currentRank: computed(() => {
        let lastKey = 0;
        for (const key in AppState.rankTitles) {
          if (AppState.AccountState.account.rank >= key) {
            lastKey = key;
          }
        }
        return AppState.rankTitles[lastKey];
      }),
      async login() {
        AuthService.loginWithPopup();
      },
      async logout() {
        AuthService.logout({ returnTo: window.location.origin });
      }
    };
  },
  components: { ProfileTitle }
}
</script>

<style lang="scss" scoped></style>
