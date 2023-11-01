<template>
  Milestones Page
  <section class="row">
    <div class="col-4">
      <h1> Milestones </h1>
      <div v-for="milestone in milestones" :key="milestone">
        <span @click="removeMilestone()" class="mdi mdi-delete selectable"></span>
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
      <h1> Create a milestone </h1>
      <form @submit.prevent="" action="" class="d-flex flex-column form-control">
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
import { computed, ref } from "vue";
import MilestonesTracker from "../components/MilestonesTracker.vue";
import { AppState } from "../AppState.js";
import Pop from "../utils/Pop.js";

export default {
  setup() {
    const editable = ref({})
    return {
      editable,
      milestones: computed(() => AppState.milestones),
      async removeMilestone() {
        try {
          // Delete milestone
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