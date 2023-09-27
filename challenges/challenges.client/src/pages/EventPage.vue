<template>
    <section class="container-fluid">
      <div class="row">
        <div class="d-flex justify-content-center align-items-center position-relative" style="top: 15em;">
          <EventForm />
        </div>
      </div>
      <div class="row position-relative">
        <div 
            v-for="(e, index) in events"
            :key="index"
            class="col-lg-5 offset-1 mobile-container d-flex justify-content-center align-items-center"
          >
          <EventCard :event="e" class="mobile-card" />
        </div>
      </div>
    </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { eventsService } from "../services/EventsService.js"
import EventForm from "../components/EventForm.vue"
import EventCard from "../components/EventCard.vue"

export default {
  components: {
    EventForm,
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