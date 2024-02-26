<template>
  <form @submit.prevent="updateAccount()" class="text-light">
    <div class="input-group py-2">
      <label for="name" class="input-group-text">Name</label>
      <input v-model="editable.name" id="name" class="form-control" type="text" minlength="3" maxlength="20"
        placeholder="Name...">
    </div>
    <img :src="editable.picture" alt="profile picture" class="img-fluid my-2 rounded-circle"
      style="width: 65px; height: 65px;">
    <div class="input-group py-2">
      <label for="picture" class="input-group-text">Profile Picture</label>
      <input v-model="editable.picture" id="picture" class="form-control" type="url" minlength="3" maxlength="300"
        placeholder="Profile Picture...">
    </div>
    <img :src="editable.coverImg" alt="cover image" class="img-fluid my-2 rounded">
    <div class="input-group py-2">
      <label for="coverImg" class="input-group-text">Cover Image</label>
      <input v-model="editable.coverImg" id="coverImg" class="form-control" type="url" minlength="3" maxlength="300"
        placeholder="Cover Image">
    </div>
    <div class="form-group py-2 bg-light rounded">
      <label for="aboutContent" class="w-100 text-dark text-center pb-1">About me</label>
      <textarea v-model="editable.bio" id="name" class="form-control" type="text" minlength="3" maxlength="250"
        placeholder="About me..." cols="20" rows="10" style="resize: none"></textarea>
    </div>
    <div class="text-center">
      <button class="btn btn-primary mt-2" type="submit">Update Account</button>
    </div>
  </form>
</template>


<script>
import Pop from '../../utils/Pop.js'
import { ref, watchEffect } from 'vue'
import { AppState } from '../../AppState.js'
import { accountService } from '../../services/AccountService.js'

export default {
  setup() {
    const editable = ref({});
    watchEffect(() => { editable.value = { ...AppState.AccountState.account } })

    return {
      editable,

      async updateAccount() {
        try { await accountService.updateAccount(editable.value); }
        catch (error) { Pop.error('[ACCOUNT FORM] updateAccount:: ' + error.message); }
      }
    }
  }
}
</script>


<style lang="scss" scoped></style>