<template>
  <div class="about text-center">
    <h1>Welcome {{ account.name }}</h1>
    <img class="rounded" :src="account.picture" :alt="account.name" />
    <img class="rounded" :src="account.coverImage" :alt="account.coverImage">
    <p>{{ account.email }}</p>
    <p>About: {{ account.aboutContent }}</p>

    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Edit Account
    </button>
  </div>


  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Account</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <AccountForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { AppState } from '../AppState';
import AccountForm from "../components/AccountForm.vue";
export default {
  setup() {
    return {
      account: computed(() => AppState.account)
    };
  },
  components: { AccountForm }
}
</script>

<style scoped>
img {
  max-width: 100px;
}
</style>
