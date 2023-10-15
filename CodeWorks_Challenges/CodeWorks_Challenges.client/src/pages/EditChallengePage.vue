  <!-- <section v-if="challenge" :key="challenge?.id" class="container-fluid">
    <SubmitChallengeForm :challenge="challenge" @submit="updateChallenge" />
    {{ challenge }}
  </section> -->
  <!-- this.id = data.id || data._id # visible only in route
  this.creatorId = data.creatorId # hidden
  this.creator = data.creator # shown with creator picture
  this.name = data.name || '' # shown, required
  this.description = data.description || '' # shown, required
  this.steps = data.steps || [] # shown, minimum of 1 step
  this.coverImg = data.coverImg || 'https://placehold.it/200x200' #shown
  this.createdAt = DateTime(data.createdAt) # shown side by side with updatedAt
  this.updatedAt = DateTime(data.updatedAt) # shown, see above
  this.supportLinks = data.supportLinks || [] # shown, links must be shown as text hyperlinks
  this.difficulty = StrDifficultyNum(data.difficulty) || 1 # shown, color changes follow challenge page styling
  this.pointValue = data.pointValue || 1 # shown, un changeable
  this.answers = data.answers || [] # shown only upon completion, answers should not be in the client side object
  this.isCancelled = data.isCancelled || false # shown
  this.participantCount = data.participantCount # shown, thumbnails of first 5 users followed by "+ participantCount others"  
  merge test--> 
<template>
  <section class="container-fluid">
    <form @submit.prevent="updateChallenge"></form>
    <input type="text" class="form-control" id="name" v-model="editable.name" required> 
    <textarea type="text" class="form-control" id="description" v-model="editable.description" required></textarea> 
    <div>
      <section>
        <h4>Add a step</h4>
        <textarea name="" id="stepText" cols="30" rows="10" ></textarea>
        <i class="mdi mdi-plus-box fs-1" @click="addStep"></i>
      </section>
      <section class="container-fluid" v-for="(step, index) in challenge.steps">
        <h1>{{ index + 1 }} <i class="mdi mdi-trash-can" @click="deleteStep(index)"></i></h1>
        <textarea name="" id="" cols="30" rows="10">{{ step }}</textarea>
      </section>
    </div>
    <input type="text" class="form-control" id="coverImg" v-model="editable.coverImage" required> 
    <!-- //REPLACE Textarea with Step thing -->
    <textarea name="supportLinks" id="" cols="30" rows="10">Support Links</textarea>
    <textarea name="answers" id="" cols="30" rows="10">Answers</textarea>
    <button @click="">Cancel Challenge</button>
    <button @click="">Resume Challenge</button>
    <button @click="">Start Challenge</button>
  </section>
  <section class="container-fluid" v-if="challenge" :key="challenge?.id">
    <button @click="editChallenge()" class="btn btn-info" v-if="!editing">Edit Challenge</button>
    <button @click="editChallenge()" class="btn btn-warning" v-if="editing">Cancel Edit</button>
    <button @click="updateChallenge()" class="btn btn-success" v-if="editing">Update Challenge</button>
  </section>
  <form v-for="(value, key) in challenge" :key="key" id="challengeForm" v-if="editing">
    <div class="d-flex justify-content-between">
      <h1>{{ key }}</h1>
      <input type="text" :value="value" class="form-control w-50">
    </div>
  </form>
  <section>
    <h4>Add a step</h4>
    <textarea name="" id="stepText" cols="30" rows="10" ></textarea>
    <i class="mdi mdi-plus-box fs-1" @click="addStep"></i>
  </section>
  <section class="container-fluid" v-for="(step, index) in challenge.steps">
    <h1>{{ index + 1 }} <i class="mdi mdi-trash-can" @click="deleteStep(index)"></i></h1>
    <textarea name="" id="" cols="30" rows="10">{{ step }}</textarea>
  </section>
</template>
  
<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { challengesService } from "../services/ChallengesService.js"
import SubmitChallengeForm from '../components/SubmitChallengeForm.vue'
import { Modal } from "bootstrap"

export default {
  components: {
    SubmitChallengeForm,
  },
  setup() {

    let editing = ref(false);
    const editable = ref({})

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(AppState.activeChallenge?.id)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function updateChallenge() {
      try {
        await challengesService.updateChallenge(editable)
        Pop.toast('Challenge Updated')
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    }

    onMounted(() => {
      setActiveChallenge()
    })

    const challenge = computed(() => AppState.activeChallenge)
    function toggleEdit(key, value){
        document.getElementById(key).innerHTML = 
        `<input class="form-control"></input>`
        document.getElementById(key).textContent = `${value}`
        const editElement = document.createElement("input")
        editElement.value = value
        editElement.id = `${key}-editing`
        logger.log(value)
        document.getElementById(key).appendChild(editElement)
    }

    function editChallenge(){
      editing.value = !editing.value
      logger.log(`You are ${editing}`)
    }

    function addStep(){
      const newStep = document.getElementById("stepText")
        challenge.value.steps.push(newStep.value)
    }

    function deleteStep(index){
        logger.log("Deleting",challenge.value.steps[index])
        challenge.value.steps.splice(index, 1)
    }

    // Dont use below
    function cancelEdit(key,value){
      document.getElementById(key).innerHTML = `<p>Edit Cancelled</p>`
    }
    return {
      updateChallenge,
      challenge: computed(() => AppState.activeChallenge),
      editChallenge,
      editing,
      addStep,
      deleteStep,
      toggleEdit,
      cancelEdit
    } 
  }
}
</script>

<style scoped lang="scss">
  i:hover{
    color: rgb(163, 235, 47);
  }
</style>