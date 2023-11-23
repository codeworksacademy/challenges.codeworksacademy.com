<template>
  <div class="" v-if="challenge">
    <section class="container-fluid text-light">
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
            <section id="requirements-section">
              <h3 for="steps">Challenge Requirements</h3>
              <!-- <span v-if="challenge.requirements.length == 0" class="text-danger">You need at least one step!</span> -->
              <h4>Add a requirement  <i class="mdi mdi-plus-box fs-1" @click="addRequirement"></i></h4>
              <textarea name="" id="requirementText" cols="30" rows="10" class="form-control mb-3"></textarea>
            </section>
            <section class="" v-for="(requirement, index) in challenge.requirements" :key="index">
              <h4>Requirement {{ index + 1 }} <i class="mdi mdi-trash-can" @click="deleteRequirement(index)"></i></h4>
              <!-- NOTE - CHANTHA - Since a challenge has potentially a surmountable amount of steps -- making this textarea an input field would be better for UX and UI. But I didn't want to change your code without your permission! Let me know your thoughts. -AJ 11/18 -->
              <textarea v-model="requirement.step" name="" id="" cols="30" rows="10" class="form-control mb-3"></textarea>
            </section>
          </div>
          <h3>Difficulty</h3>
          <select class="form-select mb-3" aria-label="Type Selection" v-model="editable.difficulty" placeholder="Select Difficulty">
            <option selected>Select Difficulty</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
          <h3>Category</h3>
          <select class="form-select mb-3" aria-label="Category Selection" v-model="editable.category">
            <option selected>Select Category</option>
            <option value="full_stack">Full-Stack</option>
            <option value="front_end">Frontend</option>
            <option value="back_end">Backend</option>
            <option value="puzzles">Puzzle</option>
            <option value="data_structures">Data Structures</option>
            <option value="style_and_design">Style and Design</option>
            <option value="other">Other</option>
          </select>
          <h3 class="mb-3">Cover Image</h3>
          <img :src="editable.coverImg" alt="" class="object-fit-cover w-100 rounded-top">
          <input type="text" class="form-control mb-3" id="coverImg" v-model="editable.coverImg" required> 
          
          <section id="answers-section">
            <h4>Answers</h4>
            <div class="d-flex input-group mb-3">
              <!-- <input type="text" class="form-control" id="answerDescription" placeholder="Answer Description">  -->
              <input type="text" class="form-control" id="answer" placeholder="Answer"> 
              <button class="btn btn-success" type="button" id="button-addon1" @click="addAnswer()">Add</button>
            </div>
            <!-- <textarea name="answers" id="" cols="30" rows="10" class="form-control mb-3" v-model="editable.answers"></textarea> -->
          </section>
          <!-- <section class="row justify-content-between" v-for="(answer, index) in challenge.answers">
            <ul class="list-group list-group-horizontal p-3">
              <li class="list-group-item list-group-item-dark flex-fill w-50">{{ answer.description }}</li>
              <li class="list-group-item list-group-item-dark flex-fill w-50">{{ answer.answer }} 
                <i class="mdi mdi-trash-can float-end fs-5 p-0" @click="deleteAnswer(index)"></i>
              </li>
            </ul>
          </section> -->
          <!-- TODO - Make it so only CodeWorks staff and/or curator's of the application can change this. I'm guessing this will be a computed property that checks if the user is an admin or not by using the AppState.user.role property. - AJ 11/18 -->
          <div class="my-4">
            <h4 class="text-center mb-3">Set Challenge Status</h4>
            <div class="col-12 d-flex justify-content-center align-items-center mb-3">
              <div  v-for="s in statusOptions" :key="s.value">
                <div class="d-flex flex-column radio-status-button">
                  <input type="radio" :value="s.value" v-model="editable.status" name="status" id="status" class="text-center fs-5">
                  <label for="status">{{ s.text }}</label>
                </div>
              </div>
            </div>
          </div>
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
import { useRoute } from 'vue-router';

export default {
  components: {
    
  },
  setup() {
    let route = useRoute()
    let editing = ref(false);
    const answer = ref('')
    const editable = ref({})
    const filterBy = ref('')
    watchEffect(() => {
      editable.value = AppState.activeChallenge
    })
    const statusOptions = ref([
      {
        text: 'Draft',
        value: 'draft'
      },
      {
        text: 'Under Review',
        value: 'under_review'
      },
      {
        text: 'Published',
        value: 'published'
      },
      {
        text: 'Deprecated',
        value: 'deprecated'
      }
    ])

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(route.params.challengeId)
        logger.log(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function updateChallenge() {
      try {
        // const stepsLength = AppState.activeChallenge.steps;
        // const description = AppState.activeChallenge.description;
        // if(AppState.activeChallenge.steps == 0){
        //   // console.log("Challenge is invalid");
        //   Pop.error("Challenge needs at least 1 step.")
        //   return;
        // }
        if(AppState.activeChallenge.description == 0){
          Pop.error("You cannot have an empty description")
          return;
        }
        await challengesService.updateChallenge(AppState.activeChallenge, AppState.activeChallenge.id)
        await this.updateChallengeStatus()
        Pop.success('Challenge Updated')
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    }

    async function updateChallengeStatus() {
      try {
        const challenge = AppState.activeChallenge
        challenge.status = 'published'
      } catch (error) {
        Pop.toast(error.message, 'error')
        logger.error(error)
      }
    }

    async function answerChallenge(){
      try{
        const res = await challengesService.submitAnswer(AppState.activeChallenge.id, answer.value)
      } catch(error){
        Pop.error(error.message)
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
      logger.log(`You are ${editing.value ? "now" : "no longer"} editing`)
    }

    function addRequirement(){
      const newRequirement = document.getElementById("requirementText")
      if(newRequirement.value.length == 0){
        Pop.error("You cannot create an empty requirement.")
        return;
      }
      challenge.value.requirements.push({
        step: newRequirement.value
      })
      Pop.success("Requirement Added")
      newRequirement.value.step = ''
    }

    function deleteRequirement(index){
        logger.log("Deleting",challenge.value.requirements[index])
        challenge.value.requirements.splice(index, 1)
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
      // if (!challenge.value.answers) {
      //   challenge.value.answers = [];
      // }
      // const newAnswerDescription = document.getElementById("answerDescription")
      const newAnswer = document.getElementById("answer")
      logger.log("new Answer", newAnswer.value)
      // if(newAnswerDescription.value.length == 0){
      //   Pop.error("You must specify an answer description.")
      //   return;
      // }
      if(newAnswer.value.length == 0){
        Pop.error("You cannot add an empty answer.")
        return;
      }
      // challenge.value.answers.push({
      //   answer: newAnswer.value,
      //   description: newAnswerDescription.value
      // })
      challenge.value.answer = newAnswer.value
      delete challenge.value.answers
      // newAnswerDescription.value = ''
      // newAnswer.value = ''
      logger.log(challenge.value)
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
      updateChallengeStatus,
      challenge: computed(() => AppState.activeChallenge),
      editChallenge,
      answerChallenge,
      editing,
      addRequirement,
      deleteRequirement,
      addSupportLink,
      deleteSupportLink,
      addAnswer,
      deleteAnswer,
      toggleEdit,
      cancelEdit,
      statusOptions,

      filterBy,
      challengeStatusEnum: computed(() => {
        if (!filterBy.value) {
          return AppState.challenges
        }
        return AppState.challenges.filter(challenge => challenge.status === filterBy.value)
      }),
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
  .radio-status-button{
    margin: 0 10px;
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
</style>