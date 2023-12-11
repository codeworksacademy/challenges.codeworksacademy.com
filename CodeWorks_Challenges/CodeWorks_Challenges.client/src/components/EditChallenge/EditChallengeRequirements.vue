<template>
    <section v-if="challenge" class="container-fluid">
        <div class="input-group mb-3">
          <input v-model="editable.type" type="text" class="form-control" placeholder="Add a Requirement">
          <label for="newRequirement" class="input-group-text btn-success btn" @click="addRequirement">Add Requirement</label>
        </div>
        <table class="table-dark bg-light text-dark w-100">
          <tr v-for="(requirement, index) in requirements">{{ requirement }} <span><i class="mdi mdi-trash-can float-end" @click="deleteRequirement(index)"></i></span></tr>
        </table>
    </section>
</template>
    
  <script>
  import { computed, onMounted, ref } from 'vue'
  import { AppState } from '../../AppState'
  import Pop from "../../utils/Pop.js"
  import { logger } from "../../utils/Logger.js"  
  import { Challenge } from "../../models/Challenge.js"
  import { challengesService } from "../../services/ChallengesService.js"
  import { useRouter } from 'vue-router';
  import { Modal } from "bootstrap"
  
  export default {
    props: {
      challenge: {
        type: [Challenge, Object],
        required: true
      }
    },
    setup(props) {
  
      const requirements = ref([])
      const editable = ref({
        type: '',
      })
  
      async function addRequirement() {
        logger.log("Adding requirement", editable.value.type)
        requirements.value.push(editable.value.type)
        editable.value.type = ''
      }

      async function deleteRequirement(index){
        logger.log("Deleting requirement", requirements.value[index])
        requirements.value.splice(index, 1)
        editable.value.type = ''
      }
  
      return {
        editable,
        addRequirement,
        deleteRequirement,
        requirements,
        user: computed(() => AppState.user)
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>