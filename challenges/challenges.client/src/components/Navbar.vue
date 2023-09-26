<template>

  <Login />
  <nav class="" style="position: relative; margin-top: 9em; background-color: #22222299; border-top: 2px solid #38BB64;  border-bottom: 2px solid #38BB64; margin-bottom: 6em;">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 d-flex justify-content-around pt-3 mx-auto">
          <router-link :to="{ name: 'Events' }">
            <a>Events</a>
          </router-link>
          <router-link :to="{ name: 'Challenges' }">
            <a>Challenges</a>
          </router-link>
          <router-link :to="{ name: 'News' }">
            <a href="http://">What's New?</a>
          </router-link>
          <router-link :to="{ name: 'Home' }">
            <div class="" style="position: relative;">
              <img src="../assets/img/bg-codeworks-logo.png" alt="Logo Background" height="200" class="roll-in" style="position: relative; top:-5em; left:0; filter:brightness(.8)">
              <img src="../assets/img/inner-codeworks-logo.png" alt="Logo Background" height="110" class="fade-in" style="position: absolute; top:-2.25em; left: 37.5px;">
            </div>
          </router-link>
          <!-- <router-link :to="{ name: 'Profile' }"> -->
            <a href="http://">My Profile</a>
          <!-- </router-link> -->
          <router-link :to="{ name: 'Leaderboard' }">
            <a href="http://">Leaderboard</a>
          </router-link>
          <router-link :to="{ name: 'Settings' }">
            <a href="http://">Settings</a>
          </router-link>
        </div>
      </div>
    </div>
  </nav>

  <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3" style="margin-top: 9em;">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
      aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto">
        <li>
          <router-link :to="{ name: 'About' }" class="btn text-success lighten-30 selectable text-uppercase">
            About
          </router-link>
        </li>
      </ul> -->
      <!-- LOGIN COMPONENT HERE -->
      <!-- <Login />
    </div>
  </nav> -->
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

<style scoped lang="scss">
@import '../assets/scss/variables.scss';

a {
  color: var(--primary-blue);
  transition: color 0.3s;
}

a:hover {
  color: var(--bs-light);
  text-decoration: none;
}

.bg-codeworks {
  background-image: url('../assets/img/bg-codeworks-logo.png');
}

.roll-in {
  animation: rollIn 1s ease-in-out forwards;
}

@keyframes rollIn {
  0% {
    overflow: hidden;
    opacity: 0;
    transform: translateX(-500%) rotate(-360deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotate(0);
  }
}

.fade-in {
  opacity: 0;
  animation: fadeIn 1s ease-in-out 1.5s forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.nav-link {
  text-transform: uppercase;
}

.navbar-nav .router-link-exact-active {
  border-bottom: 2px solid var(--bs-success);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

@media screen and (min-width: 768px) {
  nav {
    height: 64px;
  }
}
</style>
