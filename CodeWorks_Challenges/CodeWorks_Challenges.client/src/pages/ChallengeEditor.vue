<template>
  <div class="" v-if="challenge">
    <section class="container-fluid text-dark">
      <form @submit.prevent="updateChallenge">
        <div class="border-dark border-bottom my-3" id="details-section">
          <h3 for="name">Challenge Name</h3>
          <span v-if="challenge.name.length == 0" class="text-danger">You need a name!</span>
          <input type="text" class="form-control mb-3" id="name" v-model="editable.name" required> 
          <h3 for="description">Challenge Description</h3>
          <span v-if="challenge.description.length == 0" class="text-danger">You need a description!</span>
          <textarea type="text" cols="30" rows="10" class="form-control mb-3" id="description" v-model="editable.description" required></textarea> 
        </div>
          <div>
            <section id="steps-section">
              <h3 for="steps">Challenge Steps</h3>
              <span v-if="challenge.steps.length == 0" class="text-danger">You need at least one step!</span>
              <h4>Add a step  <i class="mdi mdi-plus-box fs-1" @click="addStep"></i></h4>
              <textarea name="" id="stepText" cols="30" rows="10" class="form-control mb-3"></textarea>
            </section>
            <section class="" v-for="(step, index) in challenge.steps">
              <h4>Step {{ index + 1 }} <i class="mdi mdi-trash-can" @click="deleteStep(index)"></i></h4>
              <textarea name="" id="" cols="30" rows="10" class="form-control mb-3">{{ step }}</textarea>
            </section>
          </div>
          <h3>Difficulty</h3>
          <select class="form-select mb-3" aria-label="Type Selection" v-model="editable.difficulty" placeholder="Select Difficulty">
            <option selected>Select Difficulty</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
          <h3 class="mb-3">Cover Image</h3>
          <img :src="editable.coverImg" alt="" class="object-fit-cover w-100 rounded-top">
          <input type="text" class="form-control mb-3" id="coverImg" v-model="editable.coverImg" required> 
          <h4>Support Links</h4>
          <span v-if="challenge.supportLinks.length == 0" class="text-danger">You need at least 1 support link!</span>
          <!-- <textarea name="supportLinks" id="" cols="30" rows="10" class="form-control mb-3" v-model="editable.supportLinks" required></textarea> -->
          <div class="d-flex input-group mb-3">
            <input type="text" class="form-control" id="supportLinkType" placeholder="Link Type"> 
            <input type="text" class="form-control" id="supportLink" placeholder="Link"> 
            <!-- <i class="mdi mdi-plus-box fs-2" @click="addSupportLink"></i> -->
            <button class="btn btn-success" type="button" id="button-addon1" @click="addSupportLink">Add</button>
          </div>
          <section class="row justify-content-between" v-for="(link, index) in challenge.supportLinks">
            <!-- <h4 class="text-success col-md-6">{{ link.name }} </h4>
            <h4 class="text-dark col-md-6">{{ link.url }} <i class="mdi mdi-trash-can float-end" @click="deleteSupportLink(index)"></i></h4> -->
            <ul class="list-group list-group-horizontal p-3">
              <li class="list-group-item list-group-item-dark flex-fill w-50">{{ link.name }}</li>
              <li class="list-group-item list-group-item-dark flex-fill w-50">{{ link.url }} 
                <i class="mdi mdi-trash-can float-end fs-5 p-0" @click="deleteSupportLink(index)"></i>
              </li>
              
            </ul>
          </section>
          <section id="answers-section">
            <h4>Answers</h4>
            <div class="d-flex input-group mb-3">
              <input type="text" class="form-control" id="answerDescription" placeholder="Answer Description"> 
              <input type="text" class="form-control" id="answer" placeholder="Answer"> 
              <button class="btn btn-success" type="button" id="button-addon1" @click="addAnswer()">Add</button>
            </div>
            <!-- <textarea name="answers" id="" cols="30" rows="10" class="form-control mb-3" v-model="editable.answers"></textarea> -->
          </section>
          <section class="row justify-content-between" v-for="(answer, index) in challenge.answers">
            <!-- <h4 class="text-success col-md-6">{{ link.name }} </h4>
            <h4 class="text-dark col-md-6">{{ link.url }} <i class="mdi mdi-trash-can float-end" @click="deleteSupportLink(index)"></i></h4> -->
            <ul class="list-group list-group-horizontal p-3">
              <li class="list-group-item list-group-item-dark flex-fill w-50">{{ answer.description }}</li>
              <li class="list-group-item list-group-item-dark flex-fill w-50">{{ answer.answer }} 
                <i class="mdi mdi-trash-can float-end fs-5 p-0" @click="deleteAnswer(index)"></i>
              </li>
              
            </ul>
          </section>
          <button class="btn btn-success mb-3">Update Challenge</button>
      </form>
    </section>
  </div>
  <section class="container-fluid">
    <div class="row">
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Answer</span>
        <input type="text" class="form-control" v-model="answer">
        <button class="btn btn-success" type="button" id="button-addon1" @click="answerChallenge()">Check</button>
      </div>
      <div>
        <!-- <p class="text-danger" v-if="puzzle.correct == false">
          Your answer is not correct!
        </p>
        <p class="green-color" v-if="puzzle.correct">
          Great job!
        </p> -->
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
import { useRouter } from 'vue-router';

export default {
  components: {
    
  },
  setup() {

    let editing = ref(false);
    const answer = ref('')
    const editable = ref({})
    watchEffect(() => {
      editable.value = AppState.activeChallenge
    })
    
    // async function setActiveChallenge() {
    //   try {
    //     await challengesService.setActiveChallenge(AppState.activeChallenge?.id)
    //   } catch (error) {
    //     logger.error(error)
    //     Pop.toast(error, 'error')
    //   }
    // }

    async function updateChallenge() {
      try {
        // const stepsLength = AppState.activeChallenge.steps;
        // const description = AppState.activeChallenge.description;
        if(AppState.activeChallenge.steps == 0){
          // console.log("Challenge is invalid");
          Pop.error("Challenge needs at least 1 step.")
          return;
        }
        if(AppState.activeChallenge.description == 0){
          Pop.error("You cannot have an empty description")
          return;
        }
        await challengesService.updateChallenge(AppState.activeChallenge, AppState.activeChallenge.id)
        Pop.success('Challenge Updated')
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    }

    async function answerChallenge(){
      try{
        await challengesService.submitAnswer(AppState.activeChallenge.id, answer.value)
        // logger.log(answer.value)
      } catch(error){
        Pop.error(error.message)
      }
    }
    onMounted(() => {

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
      logger.log(`You are ${editing.value ? "now" : "no longer"} editing`)
    }

    function addStep(){
      const newStep = document.getElementById("stepText")
      if(newStep.value.length == 0){
        Pop.error("You cannot create an empty step.")
        return;
      }
      challenge.value.steps.push(newStep.value)
      Pop.success("Step Added")
      newStep.value = '';
    }

    function deleteStep(index){
        logger.log("Deleting",challenge.value.steps[index])
        challenge.value.steps.splice(index, 1)
    }

    function addSupportLink(){
      const newSupportLinkType = document.getElementById("supportLinkType")
      const newSupportLink = document.getElementById("supportLink")
      logger.log("values",newSupportLinkType.value, newSupportLink.value)
      if(newSupportLinkType.value.length == 0){
        Pop.error("You must specify a link type.")
        return;
      }
      if(newSupportLink.value.length == 0){
        Pop.error("You cannot add an empty link.")
        return;
      }
      challenge.value.supportLinks.push({
        name: newSupportLinkType.value,
        url: newSupportLink.value
      })
      newSupportLinkType.value = ''
      newSupportLink.value = ''
      Pop.success("Link Added")
    }
    function addAnswer(){
      if (!challenge.value.answers) {
        challenge.value.answers = [];
      }
      const newAnswerDescription = document.getElementById("answerDescription")
      const newAnswer = document.getElementById("answer")
      logger.log("new Answer" ,newAnswerDescription.value, newAnswer.value)
      if(newAnswerDescription.value.length == 0){
        Pop.error("You must specify an answer description.")
        return;
      }
      if(newAnswer.value.length == 0){
        Pop.error("You cannot add an empty answer.")
        return;
      }
      challenge.value.answers.push({
        answer: newAnswer.value,
        description: newAnswerDescription.value
      })
      newAnswerDescription.value = ''
      newAnswer.value = ''
      logger.log(challenge.value.answers)
      Pop.success("Answer Added")
    }

    function deleteAnswer(index){
      logger.log("Deleting answer at index", challenge.value.answers[index])
      challenge.value.answers.splice(index, 1)
    }

    function deleteSupportLink(index){
      logger.log("Deleting support link at index", challenge.value.supportLinks[index])
      challenge.value.supportLinks.splice(index, 1)
    }

    // Dont use below
    function cancelEdit(key,value){
      document.getElementById(key).innerHTML = `<p>Edit Cancelled</p>`
    }
    return {
      editable,
      answer,
      updateChallenge,
      challenge: computed(() => AppState.activeChallenge),
      editChallenge,
      answerChallenge,
      editing,
      addStep,
      deleteStep,
      addSupportLink,
      deleteSupportLink,
      addAnswer,
      deleteAnswer,
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

  .mdi-trash-can{
    color: rgb(242, 114, 114);
  }
  .mdi-trash-can:hover{
    color: rgb(255, 4, 4);
  }
  .form-control{
    background-color: white
  }
</style>