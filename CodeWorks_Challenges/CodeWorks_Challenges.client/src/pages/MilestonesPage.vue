<template>
  <section class="container-fluid" v-if="milestones">

    <section class="row">
      <h1> Milestones </h1>
      <div class="col-12 col-lg-6" v-for="milestone in milestones" :key="milestone">
        <div class="milestone-container bg-dark rounded p-3 border border-5 border-success text-success">
          <span @click="removeMilestone(milestone.id)" class="mdi mdi-delete selectable text-danger fs-3"></span>
          <span @click="editMode = true, setUpMilestoneEditable(milestone)"
            class="mdi mdi-pencil selectable text-warning ms-3 fs-3"></span>

          <section class="col-12 d-flex flex-column justify-content-center milestone-info">
            <div class="row pe-4">
              <span>ID: <span class="ps-2">{{ milestone.id }}</span> </span>
              <hr class="my-1">
              <span>Ref: <span class="ps-2">{{ milestone.ref }}</span> </span>
              <hr class="my-1">
              <span>Title: <span class="ps-2">{{ milestone.title }}</span> </span>
              <hr class="my-1">
              <span>Description: <span class="ps-2">{{ milestone.description }}</span> </span>
              <hr class="my-1">
              <span>Check: <span class="ps-2">{{ milestone.check }}</span> </span>
              <hr class="my-1">
              <span>Logic: <span class="ps-2">{{ milestone.logic }}</span> </span>
            </div>
            <hr class="my-2 me-2">
            <div class="col-12 text-light mb-2">
              <div class="col-12 d-flex flex-column text-uppercase">
                <div class="m-auto mt-2 fw-bold">Logic breakdown:</div>
                <div class="col-12 d-flex flex-row mt-1 mb-2">
                  <div class="col-6 text-center">Maximum Tiers - {{ milestone.maxTierLevel }}</div>
                  <div class="col-6 text-center">Operation - {{ milestone.operation }}</div>
                </div>
              </div>
              <hr class="mt-2 me-2">
              <span class="row mb-2" style="transform: translateX(43%); font-weight: 650;">Tier Levels:</span>
              <div class="flex-container" style="transform: translateX(3%);">
                <div class="col-6 split-columns text-capitalize" v-for="(n, index) in milestone.maxTierLevel"
                  :key="index">
                  <span class="fw-semibold pe-2 mt-0">{{ index + 1 }}:</span> requires {{ milestone.tierThresholdArr[n -
                    1] }} items
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </section>
    <section class="row">
      <div class="col-lg-6">
        <h1 v-if="editMode == false" class="my-0"> Create a milestone </h1>
        <h1 v-else> Edit a milestone </h1>
        <form @submit.prevent="submitForm()" action="" class="d-flex flex-column form-control">
          <div>
            <div class="d-flex flex-column">

              <div class="d-flex flex-column">
                <label for="">Ref - What data is this milestone about
                </label>
                <select v-model="editable.ref" required>
                  <option disabled value="">Please select one</option>
                  <option>Account</option>
                  <option>Challenges</option>
                  <option>ChallengeParticipants</option>
                  <option>ChallengeModerators</option>
                  <option>Milestones</option>
                  <option>AccountMilestones</option>
                </select>
              </div>
              <label for="">Check - What string will call this milestone to be checked</label>
              <input v-model="editable.check" type="text" placeholder="check" required>
            </div>
            <div class="d-flex flex-column">
              <label for="">Highest number of possible tiers</label>
              <input v-model="editable.maxTiers" type="number" placeholder="Number" min="1" max="10" required>
            </div>
            <div>
              <label for="">Operation - How are the values going to be compared </label>
              <select v-model="editable.operation" required>
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
                Tier {{ tier }}: <input v-model="editable[tier]" type="number" min="1" max="1000" required>
              </div>
            </div>
          </div>
          <label for="">Title of The Milestone </label>
          <input v-model="editable.title" type="text" placeholder="Title" required>
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
  </section>
</template>


<script>
import { computed, onMounted, ref } from 'vue';
import MilestonesTracker from '../components/Milestones/MilestonesTracker.vue';
import { milestonesService } from '../services/MilestonesService'

import { AppState } from '../AppState';
import Pop from '../utils/Pop';
import { logger } from '../utils/Logger';

export default {
  setup() {
    const editable = ref({})
    const editMode = ref(false)

    async function getMilestones() {
      try {
        await milestonesService.getMilestones()
      } catch (error) {
        logger.error(error)
      }
    }

    onMounted(() => {
      getMilestones();
    });

    return {
      editable,
      editMode,
      milestones: computed(() => AppState.MilestoneState.milestones),
      accountMilestones: computed(() => AppState.AccountState.milestones),
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


<style lang="scss" scoped>
section.row {
  width: 100%;

  .milestone-container {
    height: initial;
    margin-bottom: 25px;

    .milestone-info {
      font-size: .9rem;

      span {
        margin: 1px 0 0;
        font-weight: 600;
        text-transform: uppercase;

        span {
          font-weight: 400;
          text-transform: capitalize;
        }
      }
    }

    .flex-container {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;

      .split-columns {
        flex-basis: 50%;
        box-sizing: border-box;
        /* Ensure padding and borders are included in the width */
        padding: 0px 2px;
        display: flex;
        flex-direction: row;
        transform: translateX(15%);
      }
    }

    .selectable {
      cursor: pointer;
    }
  }
}
</style>