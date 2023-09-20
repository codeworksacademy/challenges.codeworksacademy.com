<template>
  <div class="row d-flex justify-content-center align-items-center mt-5">
    <form class="col-8 bg-dark text-light elevation-5 rounded-2 p-4 mb-3" @submit.prevent="editAccount()">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" placeholder="Enter Name..." v-model="editable.name" />
      </div>
      <div class="mb-3">
        <label for="alias" class="form-label">Alias</label>
        <input type="text" class="form-control" id="alias" v-model="editable.alias" />
      </div>
      <div class="mb-3">
        <label for="picture" class="form-label">Picture</label>
        <input type="text" class="form-control" id="picture"
        placeholder="Upload an Image..." v-model="editable.picture" />
      </div>
      <div class="mb-3">
        <label for="coverImg" class="form-label">Cover Image</label>
        <input type="text" class="form-control" id="coverImg" placeholder="Upload a Cover Image..." v-model="editable.coverImg" />
      </div>
      <div class="mb-3">
        <label for="age" class="form-label">Age</label>
        <input type="text" class="form-control" id="age" placeholder="Enter Age (e.g. 35)" v-model="editable.age" />
      </div>
      <div class="mb-3">
        <label for="location" class="form-label">Age</label>
        <input type="text" class="form-control" id="location" placeholder="City, State" v-model="editable.location" />
      </div>
      <div class="mb-3">
        <label for="bio" class="form-label">Bio</label>
        <input type="text" class="form-control" id="bio" v-model="editable.bio" />
      </div>

      <div class="col-12 d-flex justify-content-end">
        <button type="submit" class="btn btn-primary mt-3">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from 'vue';
import { AppState } from '../AppState';
import { logger } from '../utils/Logger';
import Pop from '../utils/Pop';
import { accountService } from "../services/AccountService.js";

export default {
  setup() {

    const editable = ref({})

    watchEffect(() => {
      editable.value = { ...AppState.account }
    })

    return {
      editable,
      account: computed(() => AppState.account),

      async editAccount() {
        try {
          logger.log(editable.value)
          await accountService.editAccount(editable.value)
        } catch (error) {
          Pop.error(error.message)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>