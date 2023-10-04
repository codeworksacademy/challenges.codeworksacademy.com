<template>
  <div class="container-fluid">
    <div class="row position-relative top-0 right-0" style="z-index: 2;">
      <Login />
    </div>
    <nav class="m-auto" style="position: relative; top: 6em; margin-bottom: 6em !important; background-color: #22222299; border-top: 2px solid #38BB64;  border-bottom: 2px solid #38BB64;">
      <div class="container-fluid">
        <div class="row d-flex flex-row">
          <div class="col-5 position-relative d-flex justify-content-around align-items-center" style="bottom: 4.5rem;">
            <router-link :to="{ name: 'Events' }">
              <a>Events</a>
            </router-link>
            <router-link :to="{ name: 'Challenges' }">
              <a>Challenges</a>
            </router-link>
            <router-link :to="{ name: 'News' }">
              <a href="http://">What's New?</a>
            </router-link>
          </div>
          <div class="col-2 position-relative d-flex justify-content-center align-items-center">
            <router-link :to="{ name: 'Home' }">
              <div class="" style="position: relative;">
                <img src="../assets/img/bg-codeworks-logo.png" alt="Logo Background" height="200" class="roll-in" style="position: relative; top:-5em; left:0; filter:brightness(.8)">
                <img src="../assets/img/inner-codeworks-logo.png" alt="Logo Background" height="110" class="fade-in" style="position: absolute; top:-2.25em; left: 37.5px;">
              </div>
            </router-link>
          </div>
          <div class="col-5 position-relative d-flex justify-content-around align-items-center" style="bottom: 4.5rem;">
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
  </div>
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

nav {
  position: relative;
  margin-bottom: 0;
  background-color: var(--bs-dark);
  border-bottom: 2px solid var(--bs-success);
  border-top: 2px solid var(--bs-success);
  height: 64px;
  z-index: 1;
}

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
