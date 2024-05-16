<template>
  <section class="container-fluid">

    <section class="row" v-if="milestones">
      <div class="col-12">
        <h1 class="text-center my-3"> Milestone Management </h1>
      </div>

      <div class="col-12 col-lg-6 p-1 p-lg-3" v-for="milestone in milestones" :key="milestone.id">
        <div class="bg-dark py-3 px-4 rounded border border-5 border-success text-success">
          
          <section class="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <b class="text-secondary fs-2 mb-0 order-1">
              {{ milestone.title }}
            </b>
            <span class="text-secondary fs-6 order-3 order-lg-2">
              {{ milestone.id }}
            </span>
            <div class="d-flex flex-wrap order-2 order-lg-3">
              <i @click="editMode = true, setUpMilestoneEditable(milestone)"
              class="mdi mdi-pencil selectable text-warning fs-3 px-2"></i>
              <i @click="removeMilestone(milestone.id)" class="mdi mdi-delete selectable text-danger fs-3 px-2"></i>
            </div>
          </section>

          <div class="d-flex flex-wrap justify-content-around">

            <section class="d-flex flex-column justify-content-center px-lg-3">
              <div class="pt-3 fs-5 text-secondary">
                <hr class="my-2 my-lg-3">
                <u>DESCRIPTION</u>: 
                <div class="text-wraps">{{ milestone.description }}</div>
                <hr class="my-2 my-lg-3">
                <u>REF</u>: 
                <div>{{ milestone.ref }}</div>
                <hr class="my-2 my-lg-3">
                <u>CHECK</u>: 
                <div>{{ milestone.check }}</div>
                <hr class="my-2 my-lg-3">
                <u>LOGIC</u>: 
                <div class="text-wraps">{{ milestone.logic }}</div>
                <hr class="my-2 my-lg-3">
              </div>
            </section>

            <section class="d-flex flex-column align-items-center px-lg-3 text-light my-2">
              <div class="text-uppercase mb-3">
                <p class="my-2 fw-bold text-center">LOGIC BREAKDOWN:</p>
                <div class="d-flex justify-content-evenly flex-wrap gap-3 logic-wrap">
                  <span class="text-center">Maximum Tiers - {{ milestone.maxTierLevel }}</span>
                  <span class="text-center">Operation - {{ milestone.operation }}</span>
                </div>
              </div>
              <hr class="mt-2">
              <div class="fixed-width">
                <p class="mb-2 fw-bold text-center">TIER LEVELS:</p>
                <div class="d-flex flex-column gap-1 text-light px-4">
                  <div v-for="(n, index) in milestone.maxTierLevel <= 10 ? milestone.maxTierLevel : 10" :key="index" class="d-flex justify-content-between">
                    <div class="pe-1">Tier {{ n }}: </div>
                    <div class="mx-3">
                      <span class="me-1"> Requires </span>
                      <span class="me-1">{{ milestone.tierThresholdArr[index] }}</span>
                      <span> item{{ milestone.tierThresholdArr[index] > 1 ? 's' : '&nbsp' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

    </section>

    <hr>

    <section class="row align-items-center justify-content-center p-3">

      <div class="col-12 col-lg-auto d-flex flex-column justify-content-center">

        <div class="text-center mb-3">
          <h1 v-if="editMode == false"> Create a milestone </h1>
          <h1 v-else> Edit a milestone </h1>
        </div>

        <form @submit.prevent="submitForm()" class="card p-3 mb-3">
          <section class="d-flex flex-column">
            <div class="mb-3">
              <label for="title" class="form-label">Title of The Milestone </label>
              <input v-model="editable.title" name="title" class="form-control" type="text" placeholder="Title" required>
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description of The Milestone </label>
              <textarea v-model="editable.description" name="description" class="form-control" cols="30" rows="2" placeholder="Created XYZ Milestone" required></textarea>
            </div>
          </section>
          <section class="d-flex flex-wrap gap-3 justify-content-around align-items-center">
            <div class="d-flex flex-column">
              <div class="mb-3">
                <label for="ref" class="form-label">Ref - What data is this milestone about?</label>
                <select v-model="editable.ref" name="ref" class="form-select" required>
                  <option disabled value="">Please select one</option>
                  <option>Account</option>
                  <option>Challenges</option>
                  <option>ChallengeParticipants</option>
                  <option>ChallengeModerators</option>
                  <option>Milestones</option>
                  <option>AccountMilestones</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="check" class="form-label">Check - What string will call this milestone to be checked</label>
                <input v-model="editable.check" name="check" class="form-control" type="text" placeholder="check" required>
              </div>
              <div class="mb-3">
                <label for="operation" class="form-label">Operation - How are the values going to be compared </label>
                <select v-model="editable.operation" name="operation" class="form-select" required>
                  <option disabled value="">Please select one</option>
                  <option>$gte</option>
                  <option>$sum</option>
                  <option>$increment</option>
                  <option>$gteChallenge</option>
                </select>
              </div>
                <div class="mb-3">
                <label for="maxTierLevel" class="form-label">Number of possible tiers [1-10]</label>
                <input v-model="editable.maxTierLevel" name="maxTierLevel" class="form-control" type="number" placeholder="Number" min="1" max="10" required>
              </div>
            </div>

            <div class="d-flex flex-column mb-3 ps-lg-5">
              <label class="form-label">Requirements - each value must be higher than the previous [1-1000]</label>
              <div class="d-flex flex-column me-auto gap-1">
                <div v-for="(tier, index) in editable.maxTierLevel <= 10 ? editable.maxTierLevel : 10" :key="index" class="d-flex justify-content-between">
                  <span>Tier {{ tier }}: </span>
                  <input v-model="editable[tier]" class="rounded ms-2 text-center" type="number" min="1" max="1000" required>
                </div>
              </div>
            </div>
          </section>
          <div class="d-flex justify-content-center">
            <button v-if="editMode == false" type="submit" class="btn btn-success px-5 fw-bold">CREATE</button>
            <button v-else type="submit" class="btn btn-success px-5 fw-bold">UPDATE</button>
          </div>
        </form>

      </div>

      <div class="col-12 col-lg-auto">
        <div class="bg-dark rounded p-3 border border-5 border-success text-success d-flex flex-wrap gap-3">
          <section class="d-flex flex-column">
            <div>Title: </div>
            <p class="text-light">{{ editable.title }}</p>
            <div>DESCRIPTION: </div>
            <p class="text-light text-wraps">{{ editable.description }}</p>
            <div>REF: </div>
            <p class="text-light">{{ editable.ref }}</p>
            <div>CHECK: </div>
            <p class="text-light">{{ editable.check }}</p>
            <div>LOGIC STRING: </div>
            <p class="text-light text-wraps">{{ logic }}</p>
          </section>
          <section class="d-flex flex-column align-items-center px-lg-4 mx-auto">
            <div>LOGIC BREAKDOWN: </div>
            <p class="text-light d-flex flex-column text-center"> 
              Maximum Tiers: {{ editable.maxTierLevel }} <br> 
              Operation: {{ editable.operation }} </p>
            <div>TIER LEVELS:</div>
            <div class="d-flex flex-column gap-1 text-light">
              <div v-for="(n, index) in editable.maxTierLevel <= 10 ? editable.maxTierLevel : 10" :key="index" class="d-flex justify-content-between">
                <div class="pe-1">Tier {{ n }}: </div>
                <div class="mx-3">
                  <span class="me-1">{{ editable[n] }}</span>
                  <span> item{{ editable[n] > 1 ? 's' : '&nbsp' }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    </section>

    <hr>

    <section class="row px-lg-5">
      <div class="col-12 text-center mt-2"><h1>My Milestones</h1></div>
      <div class="col-12">
        <MilestonesTracker />
      </div>
    </section>

  </section>
</template>


<script>
import Pop from '../utils/Pop.js';
import { AppState } from '../AppState.js';
import { logger } from '../utils/Logger.js';
import { computed, onMounted, ref } from 'vue';
import { milestonesService } from '../services/MilestonesService.js'
import MilestonesTracker from '../components/Milestones/MilestonesTracker.vue';


export default {
  setup() {
    const editable = ref({});
    const editMode = ref(false);

    async function getMilestones() {
      try { await milestonesService.getMilestones(); }
      catch (error) { logger.error(error); }
    }

    onMounted(() => {
      getMilestones();
    });

    return {
      editable,
      editMode,
      milestones: computed(() => AppState.milestones),
      logic: computed(() => {
        let tempStr = '';
        let char;
        for (let i = 0; i < (editable.value.maxTierLevel <= 10 ? editable.value.maxTierLevel : 10); i++) {
          // if (editable.value[i] < editable.value[i - 1]) {
          //   return "ERROR Tier Value must increase as it's level does"
          // }
          if (i < editable.value.maxTierLevel - 1 && i < 9) {
            char = '-'
          } else char = ''
          tempStr += `${editable.value[i + 1]}` + char
        }
        let logicStr = `${editable.value.maxTierLevel}-${editable.value.operation}%${tempStr}`
        editable.value.logic = logicStr
        return editable.value.maxTierLevel > 0 ? editable.value.logic : '';
      }),
      setUpMilestoneEditable(milestone) {
        editable.value = milestone;
        for (let i = 0; i <= milestone.maxTierLevel; i++) {
          editable.value[i] = milestone.tierThresholdArr[i - 1];
        }
      },
      submitForm() {
        if (editMode.value == false) { this.createMilestone(); }
        else { this.editMilestone(); }
      },
      async createMilestone() {
        try {
          editable.value.id = '';
          const milestoneData = editable.value;
          await milestonesService.createMilestone(milestoneData);
          editable.value = {};
        } catch (error) {
          Pop.error('[MILESTONES PAGE] createMilestone:: ' + error);
        }
      },
      async editMilestone() {
        try {
          const milestoneData = editable.value;
          await milestonesService.editMilestone(milestoneData);
          editable.value = {};
          editMode.value = false;
        } catch (error) {
          Pop.error('[MILESTONES PAGE] editMilestone:: ' + error);
        }
      },
      async removeMilestone(milestoneId) {
        try {
          const confirm = await Pop.confirm('Permanently delete this milestone?');
          if (!confirm) { return }
          await milestonesService.removeMilestone(milestoneId);
        } catch (error) {
          Pop.error('[MILESTONES PAGE] removeMilestone:: ' + error);
        }
      },

      // submitCheck: computed(() => {
      //   // editable.value.logic != `ERROR Tier Value must increase as it's level does` &&
      //   if (editable.value.ref != undefined && editable.value.check != undefined && editable.value.maxTierLevel != undefined && editable.value.operation != undefined && editable.value.description != undefined) {
      //     return true
      //   } else return false
      // }),

    };
  },
  components: { MilestonesTracker }
}
</script>


<style lang="scss" scoped>
.text-wraps{
  max-width: 100dvw;
  text-wrap: wrap;
  transition: 0.5s;
}

.logic-wrap{
  max-width: 100dvw;
  text-wrap: wrap;
  transition: 0.5s;
}

.fixed-width{
  width: 100%;
}

@media screen and (min-width: 768px) {
  .text-wraps{
    max-width: 24dvw;
  }

  .logic-wrap{
    max-width: 17dvw;
  }

  .fixed-width{
    width: 18rem;
  }
}
</style>