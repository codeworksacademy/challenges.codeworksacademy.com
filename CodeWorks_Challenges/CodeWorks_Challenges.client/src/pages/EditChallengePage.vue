<template>
  <!-- <section v-if="challenge" :key="challenge?.id" class="container-fluid">
    <SubmitChallengeForm :challenge="challenge" @submit="updateChallenge" />
    {{ challenge }}
  </section> -->
  <section class="container-fluid">
    <button @click="editChallenge()" class="btn btn-info" v-if="!editing">Edit Challenge</button>
    <button @click="editChallenge()" class="btn btn-warning" v-if="editing">Cancel Edit</button>
    <button @click="updateChallenge()" class="btn btn-success">Update Challenge</button>
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
    <h1>{{ index + 1 }} <i class="mdi mdi-trash-can text-danger" @click="deleteStep(index)"></i></h1>
    <textarea name="" id="" cols="30" rows="10">{{ step }}</textarea>
  </section>
  <h1 class="text-warning">Below is my prior attempt, I will remove this when I am done.</h1>
  <div v-for="(value, key) in challenge" :key="key">
      <!-- <p>{{ key }}: {{ value }}</p> -->
      <div class="p-3">
        <h1>{{ key }}</h1>
        <h5 :id="key">{{ value }} <i class="mdi mdi-pencil" @click="toggleEdit(key, value)"></i></h5>
        <!-- <input :value="value"> -->
      </div>
  </div>
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
        await challengesService.updateChallenge(AppState.activeChallenge)
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

    function addStep(text){
      logger.log("Step Text", text)
      challenge.steps.push(text)
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
      addStep(){
      const newStep = document.getElementById("stepText")
        challenge.value.steps.push(newStep.value)
      },
      deleteStep(index){
        logger.log("Deleting",challenge.value.steps[index])
      },
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