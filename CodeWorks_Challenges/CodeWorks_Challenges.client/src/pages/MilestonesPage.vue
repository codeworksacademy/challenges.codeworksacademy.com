<template>
  Milestones Page
  <section class="row">
    <h1> Milestones </h1>
    <div class="col-4" v-for="milestone in milestones" :key="milestone">
      <div>
        <div>
          <span @click="removeMilestone(milestone.id)" class="mdi mdi-delete selectable"></span>
          <div>
            Check:
          </div>
          {{ milestone.check }}
          <div>
            Logic:
          </div>
          {{ milestone.logic }}
          <div>
            Ref:
          </div>
          {{ milestone.ref }}
          <div>
            Description:
          </div>
          {{ milestone.description }}
        </div>
      </div>
    </div>
  </section>
  <section class="row">
    <div class="col-4 mx-auto">
      <h1> Create a milestone </h1>
      <form @submit.prevent="createMilestone()" action="" class="d-flex flex-column form-control">
        <div class="d-flex">
          <div>
            <label for="">Check</label>
            <input v-model="editable.check" type="text" placeholder="check" class="bg-light">
          </div>
          <div>
            <label for="">Logic</label>
            <input v-model="editable.logic" type="text" placeholder="logic" class="bg-light">
          </div>
          <div>
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
import { AppState } from "../AppState.js";
import Pop from "../utils/Pop.js";
import { logger } from "../utils/Logger.js";

export default {
  setup() {
    const editable = ref({})
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
        await milestonesService.getAccountMilestones(userId)
      } catch (error) {
        Pop.error(error.message, '[getAccountMilestones]')
      }
    }
    watchEffect(() => {
      if (AppState.account.id) {
        getMilestones()
        getAccountMilestones()
      }
    })
    return {
      editable,
      milestones: computed(() => AppState.milestones),
      async createMilestone() {
        try {
          const milestoneData = editable.value
          await milestonesService.createMilestone(milestoneData)
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