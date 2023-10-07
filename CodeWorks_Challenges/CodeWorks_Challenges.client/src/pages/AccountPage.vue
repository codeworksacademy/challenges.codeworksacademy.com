<template>
  <div class="about text-center">
    <h1>Welcome {{ account.name }}</h1>
    <img class="rounded" :src="account.picture" alt="" />
    <p>{{ account.email }}</p>
  </div>
  <AccountForm />
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
