<!-- <template>
  <div class="modal fade bg-transparent" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
      <div class="modal-content" style="overflow-y: auto;overflow-x: hidden;">
        <div class="col-12 d-flex position-relative mb-5">
          <button type="button" class="col-1 position-absolute top-1 left-1 close-btn mb-1" data-bs-dismiss="modal" aria-label="Close" aria-closed="true"><i title="Close" class="mdi mdi-close mdi-24px"></i></button>
        </div>
        <div class="modal-header" style="border: none;">
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>
      </div> -->
        <!-- <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ...
        </div> -->
        <!-- <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div> -->
    <!-- </div>
  </div> -->
<!-- </template> -->

<!--  Located above is the component named ModalWrapper.vue. This component is used to wrap the content of a modal. The modal is a Bootstrap component that is used to display content in a popup window. The modal is used in the following components: CreateChallengeForm.vue, ChallengeSubmissionForm.vue, ChallengePage.vue, and ChallengeCard.vue. The modal is used to display the content of these components in a popup window. Let's create a template for ChallengeSubmissionForm.vue that properly uses the modal. -->

<template>
  <section v-if="user.isAuthenticated" class="container-fluid position-relative bg-secondary pt-5">
    <form @submit.prevent="createChallengeSubmission" id="createSubmissionForm">
      <div class="form-group">
        <div v-for="(link, i) in editable.supportLinks" :key="i">
          <div class="input-box">
            <input
              :id="'supportLinkName' + i"
              :name="'supportLinkName' + i"
              type="text"
              required
              v-model="link.name"
            >
            <label :for="'supportLinkName' + i">Challenge Link Name</label>
          </div>
          <div class="input-box">
            <input
              :id="'supportLinkURL' + i"
              :name="'supportLinkURL' + i"
              type="url"
              required
              v-model="link.url"
            >
            <label :for="'supportLinkURL' + i">Challenge Link URL</label>
          </div>
        </div> 
      </div>
      <button type="submit" class="btn btn-primary">Submit Application</button>

    </form>
  </section>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { Submission } from "../models/Submission.js"
import { submissionsService } from "../services/SubmissionsService.js"
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap'

export default {
  props: {
    submission: {
      type: Submission || Object,
      required: true
    }
  },
  setup() {

    const router = useRouter()

    const editable = ref({
      supportLinks: [
        {
          name: '',
          url: ''
        }
      ],
      isSubmitted: false,
    })

    const isModeratorStatus = computed(() => {
      const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    })

    async function createChallengeSubmission() {
      try {
        //if a moderator is a moderator of the challenge, then make them also a moderator of the submission:
        if (AppState.activeChallenge.moderators.find(m => m.accountId == AppState.account.id)) {
          editable.value.moderators.push({ accountId: AppState.account.id, status: true })
        }
        editable.value.isSubmitted = true
        const newSubmission = { ...editable.value }
        logger.log(editable.value)
        await submissionsService.createSubmission(newSubmission)
        Modal.getOrCreateInstance('#createSubmissionForm').hide()
        Pop.toast('Submission Created')
        router.push(
          { name: ''})
      } catch (error) {
        logger.error(error)
        Pop.toast(error.message, 'error')
      }
    }

    onMounted(() => {

    })
    return {
      user: computed(() => AppState.user),
      editable,
      isModeratorStatus,
      createChallengeSubmission
    } 
  }
}
</script>