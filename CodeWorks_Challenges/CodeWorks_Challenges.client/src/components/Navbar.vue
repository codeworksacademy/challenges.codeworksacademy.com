<template>
  <nav class="navbar navbar-expand-lg navbar-dark px-3 pt-1 pb-0" style="z-index: 1000;">
    <router-link class="navbar-brand d-flex" :to="{ name: 'Home' }">
      <div class="d-flex flex-column align-items-center">
        <img alt="logo" src="../assets/img/cw-logo.png" height="45" />
      </div>
    </router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
      aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto" style="z-index: 1000;">
        <li class="p-0">
          <router-link :to="{ name: 'Challenges' }" class="btn text-white selectable">
            Challenges
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

@media screen and (min-width: 768px) {
  nav {
    height: 64px;
  }
}

@media (max-width: 991px) {
  .navbar-collapse{
    padding-left: 1rem;
    margin-top: .25rem;
    background-color: #0B0E13;
  }
}
</style>
