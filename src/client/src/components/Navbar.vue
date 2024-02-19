<template>
  <nav class="navbar navbar-expand-lg navbar-dark py-0" style="z-index: 1000;">
    <router-link class="navbar-brand d-flex ps-3" :to="{ name: 'Home' }">
      <div class="d-flex flex-column align-items-center">
        <img alt="logo" src="../assets/img/cw-logo.png" height="45" />
      </div>
    </router-link>
    <button class="navbar-toggler me-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
      aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse rounded" id="navbarText">
      <ul class="navbar-nav me-auto gap-1" style="z-index: 1000;">
        <li class="p-0 pt-md-1 ps-2 ps-0">
          <router-link :to="{ name: 'Leaderboards' }" class="btn text-white selectable">
            <span class="fs-6 d-none d-lg-block"><i class="mdi mdi-trophy"></i> Leaderboards</span>
            <span class="fs-3 d-block d-lg-none"><i class="mdi mdi-trophy"></i> Leaderboards</span>
          </router-link>
        </li>
      </ul>
      <Login />
    </div>
  </nav>
</template>

<script>
import Login from './Login.vue';

export default {
  setup() {
    return {}
  },
  components: { Login }
}
</script>

<style scoped>
a:hover {
  text-decoration: none;
}

.nav-link {
  text-transform: uppercase;
}

.navbar-nav .router-link-exact-active {
  border-bottom: 2px solid #00CCE6;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.navbar-collapse {
  padding-left: 1rem;
  margin-top: .25rem;
}

nav {
  height: 64px;
}

@media screen and (max-width: 991px) {

  .navbar-collapse {
    background-color: #0B0E13;
  }
}

@media (max-width: 280px) {
  .navbar-collapse {
    padding-left: 0;
    margin: 0;
  }

  .navbar-toggler {
    padding: .125rem;
    margin: 0;

  }
}
</style>
