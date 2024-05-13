<template>
  <form class="container-fluid card p-3 my-3" @submit.prevent="updateProfile()">
    <section class="row justify-content-between">
      <div class="col-12">
        <p class="fs-3 text-center">Edit profile</p>
        <hr>
      </div>

      <div class="col-12 col-md-6">
        <section class="user">
          <div class="m-3 mt-0 me-2 pe-2">
            <span class="d-none d-xl-flex">
              <span class="w-100">
                <span class="d-flex align-items-center">
                  <i class="mdi mdi-text-account me-1 fs-3"></i>
                  <label for="name">Name</label>
                </span>
                <input v-model="editable.name" class="ms-2 form-control" type="text" id="name" maxlength="96">
              </span>
              <span class="w-100">
                <span class="d-flex align-items-center">
                  <i class="mdi mdi-tag-text-outline ms-2 me-1 fs-3"></i>
                  <label for="name">Nickname</label>
                </span>
                <input v-model="editable.nickname" class="ms-2 form-control" type="text" id="nickname" maxlength="64">
              </span>
            </span>
            <span class="d-flex d-xl-none">
              <span class="w-100">
                <span class="d-flex align-items-center">
                  <i class="mdi mdi-text-account me-1 fs-3"></i>
                  <label for="name">Name/Nickname</label>
                </span>
                <input v-model="editable.name" class="ms-2 form-control" type="text" id="name" maxlength="96" placeholder="name">
                <input v-model="editable.nickname" class="ms-2 form-control" type="text" id="nickname" maxlength="64" placeholder="nickname">
              </span>
            </span>
          </div>
          <div class="m-3 mt-0">
            <span class="d-flex align-items-center">
              <i class="mdi mdi-email-lock-outline me-1 fs-3"></i>
              <label for="picture">Account Email</label>
            </span>
            <input v-model="editable.email" class="ms-2 form-control" type="url" id="email" maxlength="256" disabled>
          </div>
          <div class="m-3 mt-0">
            <span class="d-flex align-items-center">
              <i class="mdi mdi-account me-1 fs-3"></i>
              <label for="picture">User Picture</label>
            </span>
            <input v-model="editable.picture" class="ms-2 form-control" type="url" id="picture" maxlength="256" placeholder="URL">
          </div>
          <div class="m-3 mt-0">
            <span class="d-flex align-items-center">
              <i class="mdi mdi-panorama-variant me-1 fs-3"></i>
              <label for="picture">Cover Picture</label>
            </span>
            <input v-model="editable.coverImg" class="ms-2 form-control" type="url" id="picture" maxlength="256" placeholder="URL">
          </div>
        </section>
      </div>
      <div class="col-12 col-md-6">
        <section class="socials">
          <div class="m-3 mt-0">
            <span class="d-flex align-items-center">
              <i class="mdi mdi-github me-1 fs-3"></i>
              <label for="github">Github</label>
            </span>
            <input v-model="editable.github" class="ms-2 form-control" type="url" id="github" maxlength="64" placeholder="URL">
          </div>
          <div class="m-3 mt-0">
            <span class="d-flex align-items-center">
              <i class="mdi mdi-linkedin me-1 fs-3"></i>
              <label for="linkedin">LinkedIn</label>
            </span>
            <input v-model="editable.linkedin" class="ms-2 form-control" type="url" id="linkedin" maxlength="64" placeholder="URL">
          </div>
          <div class="m-3 mt-0">
            <span class="d-flex align-items-center">
              <i class="mdi mdi-file-pdf-box me-1 fs-3"></i>
              <label for="resume">Resume</label>
            </span>
            <input v-model="editable.resume" class="ms-2 form-control" type="url" id="resume" maxlength="64" placeholder="URL">
          </div>
          <div class="m-3 mt-0">
            <span class="d-flex align-items-center">
              <i class="mdi mdi-professional-hexagon me-1 fs-3"></i>
              <label for="website">Portfolio Link</label>
            </span>
            <input v-model="editable.portfolioLink" class="ms-2 form-control" type="text" id="website" maxlength="64" placeholder="URL">
          </div>
        </section>
      </div>
      <div class="col-12">
        <div class="mx-3 mt-0 mb-4">
          <label for="bio">Bio</label>
          <textarea v-model="editable.bio" class="ms-2 form-control" name="bio" id="bio" rows="4"
            maxlength="500"></textarea>
        </div>
        <hr>
      </div>

      <div class="d-flex justify-content-center pe-3">
        <button class="btn btn-success">Submit Changes</button>
      </div>
    </section>
  </form>
</template>


<script>
import Pop from "../../utils/Pop.js";
import { ref, watchEffect } from "vue";
import { AppState } from "../../AppState.js";
import { accountService } from "../../services/AccountService.js";

export default {
  setup() {
    const editable = ref({});
    watchEffect(() => {
      if (AppState.AccountState.account) {
        editable.value = { ...AppState.AccountState.account };
      }
      else {
        editable.value = {};
      }
    });
    return {
      editable,
      async updateProfile() {
        try { await accountService.updateProfile(editable.value); }
        catch (error) { Pop.error(error); }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>