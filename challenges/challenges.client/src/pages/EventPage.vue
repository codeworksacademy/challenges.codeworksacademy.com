<template>
    <section class="container-fluid">
      <EventCard />
      <p> {{ events }} </p>
    </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { eventsService } from "../services/EventsService.js"
import EventCard from "../components/EventCard.vue"

export default {
  components: {
    EventCard
  },
  setup() {

    async function getAllEvents() {
      try {
        await eventsService.getAllEvents()
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    onMounted(() => {
      getAllEvents()
    })
    return {
      events: computed(() => AppState.events),
    } 
  }
}
</script>

<style scoped lang="scss">

</style>