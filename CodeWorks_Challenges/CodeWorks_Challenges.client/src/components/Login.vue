<template>
  <span class="navbar-text p-0">
    <button class="btn selectable text-success lighten-30 text-uppercase my-2 my-lg-0" @click="login"
      v-if="!user.isAuthenticated">
      Login
    </button>
    <div v-else>
      <div class="dropdown my-2 my-lg-0">
        <div type="button" class="border-0 selectable no-select" data-bs-toggle="dropdown" aria-expanded="false">
          <div v-if="account.picture || user.picture" class="d-flex align-items-center">
            <div class="me-2">
              <img :src="account.picture || user.picture" alt="account photo" class="avatar-xs light-gold-border" />
            </div>
            <div class="text-white">
              <p class="m-0 fs-5">{{ account.name }} <span>Staff?</span></p>
              <p class="m-0">
                <span class="bg-success rounded me-2" style="padding: 2px">{{ currentRank }} </span>
                <span class="float-end">
                  {{ account.rank }} 
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
            <router-link :to="{ name: 'Account.overview' }">
              <div class="list-group-item dropdown-item list-group-item-action">
                View Account
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
export default {
  setup() {
    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.AccountState.account),
      currentRank: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (AppState.AccountState.account.rank >= key) {
            lastKey = key
          }
        }

        return AppState.rankTitles[lastKey]
      }),

      async login() {
        AuthService.loginWithPopup()
      },
      async logout() {
        AuthService.logout({ returnTo: window.location.origin })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
