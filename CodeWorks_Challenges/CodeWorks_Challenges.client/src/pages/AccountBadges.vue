<template>
  <div class="container-fluid">
    <section class="row my-3">
      <div class="col-12 text-white">
        <h5>
        </h5>
      </div>
      <div class="col-12" v-if="milestones">
        <MilestonesTracker :milestones="milestones" />
      </div>
    </section>
  </div>
</template>

<script>
import { AppState } from "../AppState.js";
import MilestonesTracker from '../components/MilestonesTracker.vue';
import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import { logger } from "../utils/Logger.js";
import Pop from "../utils/Pop.js";
import { onMounted } from 'vue'


export default {
  setup() {

    async function getAccountMilestonesByUserId() {
      try {
        const userId = AppState.account.id
        await accountMilestonesService.getAccountMilestonesByUserId(userId)
      } catch (error) {
        Pop.error(error)
        logger.error(error)
      }
    }

    onMounted(() => {
      getAccountMilestonesByUserId()
    })

    return {
      milestones: AppState.milestones
    }
  },

  components: { MilestonesTracker }
}
</script>

<style scoped lang="scss">

</style>