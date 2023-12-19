<template>
  Milestones Page
  <section class="row" v-if="milestones">
    <h1> Milestones </h1>
    <div class="col-4" v-for="milestone in milestones" :key="milestone">
      <div>
        <div class="bg-dark rounded p-3 border border-5 border-success text-success">
          <span @click="removeMilestone(milestone.id)" class="mdi mdi-delete selectable text-danger fs-3"></span>
          <span @click="editMode = true, setUpMilestoneEditable(milestone)"
            class="mdi mdi-pencil selectable text-warning ms-3 fs-3"></span>
          <div>
            ID:
            <div class="text-light">
              {{ milestone.id }}
            </div>
          </div>
          <div>
            REF:
          </div>
          <div class="text-light">
            {{ milestone.ref }}
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
            Logic breakdown:
          </div>
          <div class="text-light">
            Maximum Tiers - {{ milestone.maxTierLevel }} <br> Operation - {{ milestone.operation }}
            <div>Tier Levels:</div>
            <div v-for="(n, index) in milestone.maxTierLevel" :key="index">
              {{ index + 1 }}: requires {{ milestone.tierThresholdArr[n - 1] }} items
            </div>
          </div>

          <div>
            Title:
          </div>
          <div class="text-light">
            {{ milestone.title }}
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
    <div class="col-6">
      <h1 v-if="editMode == false"> Create a milestone </h1>
      <h1 v-else> Edit a milestone </h1>
      <form @submit.prevent="submitForm()" action="" class="d-flex flex-column form-control">
        <div>
          <div class="d-flex flex-column">

            <div class="d-flex flex-column">
              <label for="">Ref - What data is this milestone about (Must be the objects name registered to dbContext)
              </label>
              <input v-model="editable.ref" type="text" placeholder="ref" class="bg-light" required>
            </div>
            <label for="">Check - What string will call this milestone to be checked</label>
            <input v-model="editable.check" type="text" placeholder="check" class="bg-light" required>
          </div>
          <div class="d-flex flex-column">
            <label for="">Highest number of possible tiers</label>
            <input v-model="editable.maxTiers" type="number" placeholder="Number" class="bg-light" min="1" max="1000"
              required>
          </div>
          <div>
            <label for="">Operation - How are the values going to be compared </label>
            <select class="text-dark" v-model="editable.operation" required>
              <option disabled value="">Please select one</option>
              <option>$gte</option>
              <option>$sum</option>
              <option>$increment</option>
              <option>$gteChallenge</option>
            </select>
          </div>
          <div v-if="editable.maxTiers">
            <label for="">Requirements - each value must be higher than the previous (1-1000)</label>
            <div v-for="(tier, index) in editable.maxTiers" :key="index">
              Tier {{ tier }}: <input v-model="editable[tier]" type="number" class="bg-light" min="1" max="1000" required>
            </div>
          </div>
        </div>
        <label for="">Title of The Milestone </label>
        <input v-model="editable.title" type="text" placeholder="Title" class="bg-light" required>
        <label for="">Description of The Milestone </label>
        <textarea v-model="editable.description" name="" id="" cols="30" rows="2" placeholder="Created XYZ Milestone"
          class="d-flex" required></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
    <div class="col-6">
      <div class="bg-dark rounded p-3 border border-5 border-success text-success mt-5">
        <div>
          REF:
        </div>
        <div class="text-light">
          {{ editable.ref }}
        </div>
        CHECK:
        <div class="text-light">
          {{ editable.check }}
        </div>
        <div>
          LOGIC:
        </div>
        <div class="text-light">
          {{ logic }}
        </div>
        <div>
          Logic breakdown:
        </div>
        <div class="text-light">
          Maximum Tiers - {{ editable.maxTiers }} <br> Operation - {{ editable.operation }}
          <div>Tier Levels:</div>
          <div v-for="(n, index) in editable.maxTiers" :key="index">
            {{ index + 1 }}: requires {{ editable[n] }} items
          </div>
        </div>

        <div>
          Title:
        </div>
        <div class="text-light">
          {{ editable.title }}
        </div>
        <div>
          DESCRIPTION:
        </div>
        <div class="text-light">
          {{ editable.description }}
        </div>
      </div>
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
      logic: computed(() => {
        let tempStr = ''
        let char
        for (let i = 0; i < editable.value.maxTiers; i++) {
          // if (editable.value[i] < editable.value[i - 1]) {
          //   return "ERROR Tier Value must increase as it's level does"
          // }
          if (i < editable.value.maxTiers - 1) {
            char = '-'
          } else char = ''
          tempStr += `${editable.value[i + 1]}` + char
        }
        let logicStr = `${editable.value.maxTiers}-${editable.value.operation}%${tempStr}`
        editable.value.logic = logicStr
        return editable.value.logic
      }),
      submitCheck: computed(() => {
        // editable.value.logic != `ERROR Tier Value must increase as it's level does` &&
        if (editable.value.ref != undefined && editable.value.check != undefined && editable.value.maxTiers != undefined && editable.value.operation != undefined && editable.value.description != undefined) {
          return true
        } else return false
      }),
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
      setUpMilestoneEditable(milestone) {
        editable.value = milestone
        editable.value.maxTiers = milestone.maxTierLevel
        editable.value.operation = milestone.operation
        for (let i = 0; i <= milestone.maxTierLevel; i++) {
          editable.value[i] = milestone.tierThresholdArr[i - 1]

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