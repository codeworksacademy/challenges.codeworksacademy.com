<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-12 d-flex justify-content-end align-items-center pe-0">
        <span class="navbar-text p-0 me-lg-5 d-flex flex-row" style="position: absolute; top: 0;">
          <button 
            class="btn selectable lighten-30 my-2 my-lg-3 me-3"
            style="color: #797A7A; font-weight: 750; opacity: .8;"
            @click="login"
            v-if="!user.isAuthenticated"
          >
            Sign In
          </button>
          <!-- NOTE - Can we connect this binding statement for users with no account (v-if="!account") to see the "Get Started" button? -->
          <div v-if="!user.isAuthenticated" class="btn selectable my-2 my-lg-3 me-5">
            <button class="sign-up-btn">
              Get Started
            </button>
          </div>
          <div v-else>
            <div class="dropdown my-3">
              <div type="button" class="bg-dark border-0 selectable no-select" data-bs-toggle="dropdown" aria-expanded="false">
                <div v-if="account.picture || user.picture">
                  <img :src="account.picture || user.picture" alt="account photo" height="40" class="rounded" />
                </div>
              </div>
              <div class="dropdown-menu dropdown-menu-lg-end dropdown-menu-start p-0" aria-labelledby="authDropdown">
                <div class="list-group">
                  <router-link :to="{ name: 'Account' }">
                    <div class="list-group-item dropdown-item list-group-item-action">
                      Manage Account
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
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import { AuthService } from '../services/AuthService'
export default {
  setup() {
    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.account),
      isMobile: computed(() => window.innerWidth <= 768),
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

.sign-up-btn {
  background-color: #38BB64;
  border-radius: 0.5rem;
  padding: 0.25rem .75rem;
  font-weight: 500;
  color: #121722;
  transition: background-color 0.3s;
}

</style>
