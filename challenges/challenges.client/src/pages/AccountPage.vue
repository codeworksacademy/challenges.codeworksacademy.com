<template>
  <section class="container-fluid">
    <div class="row">
      <div class="justify-content-center align-items-center">
        <div class="col-12">
          <div
            :style="{ background: `url(${account.coverImg})` }"
            style="position: relative; top: 0; right: 0; left: 0; background-position: center; background-size: cover; background- background-repeat: no-repeat; height: 50vh; z-index: 0"
          >
          <!-- ANCHOR - Space for modal button for account edits -->
          </div>
        </div>
      </div>
    </div>

    <div class="row p-5">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h1>Welcome {{ account.name }}</h1>
      </div>
      <div class="col-12 d-flex flex-row justify-content-center align-items-center">
        <div class="text-center">
          <img class="rounded-circle" :src="account.picture" alt="Account Picture" />
          <p>Alias: {{ account.alias }}</p>
          <p>Email: {{ account.email }}</p>
        </div>
      </div>
      <div class="col-12">
        <div class="bio-container">
          <p class="bio p-5 m-5">{{ account.bio }}</p>
        </div>
      </div>
    </div>

    <EditAccountForm />

  </section>
</template>

<script>
import { computed } from 'vue';
import { AppState } from '../AppState';
import EditAccountForm from '../components/EditAccountForm.vue';

export default {

  components: {
    EditAccountForm,
  },

  setup() {

    return {
      account: computed(() => AppState.account),
    }
  }
}
</script>

<style scoped lang="scss">
.container-fluid {
  padding: 0;
  overflow: hidden;
}
img {
  max-width: 100px;
}

.bio-container {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
}

.bio {
  color: white;
  font-size: 1.2rem;
  background: linear-gradient(to right bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.25));
  padding: 10px;
  border-radius: 5px;
}

.hide-backdrop {
  backdrop-filter: none;
}
</style>
