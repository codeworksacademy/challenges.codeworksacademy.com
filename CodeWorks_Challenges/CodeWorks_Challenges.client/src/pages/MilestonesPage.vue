<template>
  Milestones Page
  <section class="row">
    <h1> Milestones </h1>
    <div class="col-4" v-for="milestone in milestones" :key="milestone">
      <div>
        <div class="bg-dark rounded p-3 border border-5 border-success text-success">
          <span @click="removeMilestone(milestone.id)" class="mdi mdi-delete selectable text-danger fs-3"></span>
          <span @click="editMode = true, editable = milestone"
            class="mdi mdi-pencil selectable text-warning ms-3 fs-3"></span>
          <div>
            ID:
            <div class="text-light">
              {{ milestone.id }}
            </div>
          </div>
          CHECK:
          <div class="text-light">
            {{ milestone.check }}
          </div>
          <div>
            LOGIC:
          </div>
          <div class="text-light">
            {{ milestone.logic }}
          </div>
          <div>
            REF:
          </div>
          <div class="text-light">
            {{ milestone.ref }}
          </div>
          <div>
            DESCRIPTION:
          </div>
          <div class="text-light">
            {{ milestone.description }}
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="row">
    <div class="col-4 mx-auto">
      <h1 v-if="editMode == false"> Create a milestone </h1>
      <h1 v-else> Edit a milestone </h1>
      <form @submit.prevent="submitForm()" action="" class="d-flex flex-column form-control">
        <div>
          <div class="d-flex flex-column">
            <label for="">Check</label>
            <input v-model="editable.check" type="text" placeholder="check" class="bg-light">
          </div>
          <div class="d-flex flex-column">
            <label for="">Logic</label>
            <input v-model="editable.logic" type="text" placeholder="logic" class="bg-light">
          </div>
          <div class="d-flex flex-column">
            <label for="">Ref</label>
            <input v-model="editable.ref" type="text" placeholder="ref" class="bg-light">
          </div>
        </div>
        <textarea v-model="editable.description" name="" id="" cols="30" rows="2" placeholder="Descripton"
          class="d-flex"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  </section>
  <section class="row">
    <MilestonesTracker />
  </section>
</template>


<script>
import { computed, ref, watchEffect } from "vue";
import MilestonesTracker from "../components/MilestonesTracker.vue";
import { milestonesService } from "../services/MilestonesService.js"
import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import { AppState } from "../AppState.js";
import Pop from "../utils/Pop.js";
import { logger } from "../utils/Logger.js";

export default {
  setup() {
    const editable = ref({})
    const editMode = ref(false)
    async function getMilestones() {
      try {
        await milestonesService.getMilestones()
      } catch (error) {
        Pop.error(error.message, '[getMilestones]')
      }
    }
    async function getAccountMilestones() {
      try {
        const userId = AppState.account.id
        await accountMilestonesService.getAccountMilestones(userId)
      } catch (error) {
        Pop.error(error.message, '[getAccountMilestones]')
      }
    }
    watchEffect(() => {
      if (AppState.account.id) {
        getMilestones()
        // getAccountMilestones()
      }
    })
    return {
      editable,
      editMode,
      milestones: computed(() => AppState.milestones),
      submitForm() {
        if (editMode.value == false) {
          this.createMilestone()
        } else {
          this.editMilestone()
        }
      },
      async createMilestone() {
        try {
          editable.value.id = ''
          const milestoneData = editable.value
          await milestonesService.createMilestone(milestoneData)
          editable.value = {}
        } catch (error) {
          Pop.error(error)
        }
      },
      async editMilestone() {
        try {
          const milestoneData = editable.value
          await milestonesService.editMilestone(milestoneData)
          editable.value = {}
          editMode.value = false
        } catch (error) {
          Pop.error(error)
        }
      },
      async removeMilestone(milestoneId) {
        try {
          logger.log('MILESTONEID???', milestoneId)
          const confirm = await Pop.confirm('Delete yes?')
          if (!confirm) {
            return
          }
          await milestonesService.removeMilestone(milestoneId)
        } catch (error) {
          Pop.error(error)
        }
      }
    };
  },
  components: { MilestonesTracker }
}
</script>


<style lang="scss" scoped></style>