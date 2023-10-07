<template>
  <form @submit.prevent="updateAccount()">
    <div class="form-group py-2">
      <label for="name">Name</label>
      <input v-model="editable.name" id="name" class="form-control" type="text" minlength="3" maxlength="20"
        placeholder="Name...">
    </div>
    <div class="form-group py-2">
      <label for="picture">Picture</label>
      <input v-model="editable.picture" id="picture" class="form-control" type="url" minlength="3" maxlength="300"
        placeholder="Image...">
    </div>
    <div class="text-end">
      <button class="btn btn-action mt-2" type="submit">Update</button>
    </div>
  </form>
</template>


<script>
import { computed, ref, watchEffect } from "vue"
import { AppState } from "../AppState"
import Pop from "../utils/Pop.js"
import { accountService } from "../services/AccountService.js"

export default {
  setup() {
    const editable = ref({})
    watchEffect(() => {
      editable.value = { ...AppState.account }
    })
    return {
      editable,
      account: computed(() => AppState.account),

      async updateAccount() {
        try {
          await accountService.updateAccount(editable.value)
        } catch (error) {
          Pop.error(error.message, '[UPDATING ACCOUNT]')
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped></style>