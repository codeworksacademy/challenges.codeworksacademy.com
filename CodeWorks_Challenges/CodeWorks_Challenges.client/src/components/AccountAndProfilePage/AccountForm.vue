<template>
  <form @submit.prevent="updateAccount()">
    <div class="form-group py-2">
      <label for="name">Name</label>
      <input v-model="editable.name" id="name" class="form-control" type="text" minlength="3" maxlength="20"
        placeholder="Name...">
    </div>
    <div class="form-group py-2">
      <label for="picture">Profile Picture</label>
      <img :src="editable.picture" alt="profile picture" class="img-fluid my-2 rounded">
      <input v-model="editable.picture" id="picture" class="form-control" type="url" minlength="3" maxlength="300"
        placeholder="Profile Picture...">
    </div>
    <div class="form-group py-2">
      <label for="coverImg">Cover Image</label>
      <img :src="editable.coverImg" alt="cover image" class="img-fluid my-2 rounded">
      <input v-model="editable.coverImg" id="coverImg" class="form-control" type="url" minlength="3" maxlength="300"
        placeholder="Cover Image">
    </div>
    <div class="form-group py-2">
      <label for="aboutContent">About me</label>
      <textarea v-model="editable.aboutContent" id="name" class="form-control" type="text" minlength="3" maxlength="250"
        placeholder="About me..." cols="20" rows="10" style="resize: none"></textarea>
    </div>
    <div class="text-end">
      <button class="btn btn-primary mt-2" type="submit">Update</button>
    </div>
  </form>
</template>


<script>
import Pop from '../../utils/Pop'
import { AppState } from '../../AppState'
import { computed, ref, watchEffect } from 'vue'
import { accountService } from '../../services/AccountService'

export default {
  setup() {
    const editable = ref({})
    watchEffect(() => {
      editable.value = { ...AppState.AccountState.account }
    })
    return {
      editable,
      account: computed(() => AppState.AccountState.account),

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