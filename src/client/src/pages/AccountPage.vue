<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12">
        <EditAccountForm />
        <br>
      </div>
    </section>
    <section class="row">
      <hr>
      <span class="text-center fs-5">PREVIEW</span>
      <div class="col-12">
        <UserCard :profile="account" />
      </div>
    </section>
  </div>
</template>


<script>
import { AppState } from "../AppState.js";
import { computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserCard from "../components/UserCard.vue";
import EditAccountForm from "../components/Forms/EditAccountForm.vue";

export default {
  components: { EditAccountForm, UserCard },
  setup() {
    const route = useRoute();
    const router = useRouter();

    watchEffect(() => {
      if (route.params.profileId != AppState.AccountState.account?.id) {
        router.push({ name: 'Account', params: { profileId: AppState.AccountState.account?.id } })
      }
    })

    return {
      account: computed(() => AppState.AccountState.account),
    }
  }
};
</script>


<style lang="scss" scoped>

</style>