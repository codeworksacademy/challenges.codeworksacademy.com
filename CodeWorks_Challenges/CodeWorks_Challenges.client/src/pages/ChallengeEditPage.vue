  <template>
    <section class="container-fluid">
      <div class="row">
        <div class="col-md-3 overflow-auto p-0 border-end" id="menu">
          <h4 class="ps-3 py-3">Edit Challenge</h4>
          <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne" @click="changeRoute('details')">
                  Challenge Details
                </button>
              </h2>
              <div id="flush-collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                  <h5 class="p-3 border-dark border-bottom">Details</h5>
                  <h5 class="p-3 border-dark border-bottom">Steps</h5>
                  <h5 class="p-3 border-dark border-bottom">Answers</h5>
                  <h5 class="p-3 border-dark border-bottom">Support Links</h5>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo" @click="changeRoute('grading')">
                  Challenge Moderation
                </button>
              </h2>
              <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                  <h5 class="p-3 border-dark border-bottom">Users</h5>
                  <h5 class="p-3 border-dark border-bottom">Moderators</h5>
                  <h5 class="p-3 border-dark border-bottom d-flex flex-row justify-content-between">Notifications<span class="ps-1 text-danger">12<i class="mdi mdi-alert-box text-danger"></i></span></h5>
                  <h5 class="p-3 border-dark border-bottom">Submissions</h5>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                  Another thing?
                </button>
              </h2>
              <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                  <img src="https://imgs.search.brave.com/PquqEeuG_6NAbGfVRYdgETPj46OsY7tbYiGmlkT3_QI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAwLzMzLzMzLzgw/LzM2MF9GXzMzMzM4/MDc2X3k0bWY1cnFo/eGRleW5wUjY3ZWxv/TEZtMERrTEVEbHQy/LmpwZw" class="object-fit-cover w-100 h-100">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8 h-100 overflow-auto" style="height: 1080px">
          <router-view/>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { computed, onMounted, ref, watchEffect} from 'vue'
  import { AppState } from '../AppState'
  import Pop from "../utils/Pop.js"
  import { logger } from "../utils/Logger.js"
  import { challengesService } from "../services/ChallengesService.js"
  import { Modal } from "bootstrap"
  import { useRoute, useRouter } from 'vue-router';
  import { router } from '../router'
  
  export default {
    components: {
      
    },
    setup() {
      const route = useRoute()
      const router = useRouter()
      function changeRoute(route){
        router.push({
          path: `${route}`
        })
      } 
      onMounted(() => {
        // setActiveChallenge()
        changeRoute(`details`)
      })
      async function setActiveChallenge(){
        try{
          const challengeId = route.params.challengeId
          await challengesService.setActiveChallenge(challengeId)
          logger.log('Getting challenge:', challengeId)
        } catch (error){
          logger.log(error)
          Pop.error('error', error)
        }
      }
      return {
        changeRoute,
        activeChallenge: computed(() => AppState.activeChallenge)
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
    #menu{
      height: 1080px;
    }
  </style>