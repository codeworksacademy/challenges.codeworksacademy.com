<template>
  <div class="container">
    <section class="row">
      <div class="col-12">
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
      </div>
    </section>

    <section class="row">
      <div class="col-8 mx-auto">
        Reputation: <span>Reputation Title</span>
      </div>
    </section>

    <section class="row">
      <div class="col-8 mx-auto">
        Badges: <span>Array of Badges</span>
      </div>
    </section>

    <section class="row">
      <div class="col-8 mx-auto">
        Challeges Owned: <span>Array of Challenges - That you own</span>
      </div>
    </section>

    <section class="row">
      <div class="col-8 mx-auto">
        Challenges Moderator: <span>Array of Challenges - That you are a moderator of</span>
      </div>
    </section>

    <section class="row">
      <div class="col-8 mx-auto">
        Challenges Joined: <span>Array of Challenges - That you have joined / uncompleted?</span>
      </div>
    </section>

    <section class="row">
      <div class="col-8 mx-auto">
        Challenges Joined: <span>Array of Challenges - That you have completed</span>
      </div>
    </section>

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
span {
  color: green;
}

img {
  max-width: 100px;
}

.row {
  font-weight: bold;
  margin-bottom: 16px;
}
</style>
