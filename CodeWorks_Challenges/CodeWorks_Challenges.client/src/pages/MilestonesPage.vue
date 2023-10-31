<template>
  Milestones Page
  <section class="row">
    <div class="col-4">
      <h1> Milestones </h1>
      <div v-for="milestone in milestones" :key="milestone">
        <p>
          Check:
        </p>
        {{ milestone.check }}
        <p>
          Logic:
        </p>
        {{ milestone.logic }}
        <p>
          Ref:
        </p>
        {{ milestone.ref }}
        <p>
          Description:
        </p>
        {{ milestone.description }}
        <span @click="removeMilestone()" class="mdi mdi-delete selectable"></span>
      </div>
      <h1> Create a milestone </h1>
      <form @submit.prevent="" action="" class="d-flex flex-column form-control">
        <label for="">Check</label>
        <input type="text" placeholder="check" class="bg-light">
        <label for="">Logic</label>
        <input type="text" placeholder="logic" class="bg-light">
        <label for="">Ref</label>
        <input type="text" placeholder="ref" class="bg-light">
        <textarea name="" id="" cols="30" rows="2" placeholder="Descripton"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  </section>
  <section class="row">
    <MilestonesTracker />
  </section>
</template>


<script>
import { computed } from "vue";
import MilestonesTracker from "../components/MilestonesTracker.vue";
import { AppState } from "../AppState.js";
import Pop from "../utils/Pop.js";

export default {
  setup() {
    return {
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