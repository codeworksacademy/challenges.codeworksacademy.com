<template>
    <section class="container-fluid" v-if="challenge">
      <div class="input-group mb-3">
        <label class="input-group-text" for="challengeName">Challenge Name</label>
        <input type="text" class="form-control" id="challengeName">
      </div>
      <div class="input-group mb-3">
        <label class="input-group-text" for="challengeCoverImage">Cover Image</label>
        <input type="text" class="form-control" id="challengeCoverImage">
      </div>
      <div class="input-group mb-3">
        <label class="input-group-text" for="challengeCategory">Category</label>
        <select class="form-select text-center" id="challengeCategory">
          <option selected>Choose Category</option>
          <option value="full stack">Full-Stack</option>
          <option value="front end">Frontend</option>
          <option value="back end">Backend</option>
          <option value="puzzles">Puzzle</option>
          <option value="data structures">Data Structures</option>
          <option value="style and design">Style and Design</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="input-group mb-3">
        <label class="input-group-text" for="challengeDifficulty">Difficulty</label>
        <select class="form-select text-center" id="challengeDifficulty">
          <option selected>Choose Difficulty</option>
          <option value="easy" class="bg-success">Easy</option>
          <option value="medium" class="bg-warning">Medium</option>
          <option value="hard" class="bg-danger">Hard</option>
        </select>
      </div>
      <div class="input-group mb-3">
        <label class="input-group-text" for="challengeAnswer">Answer</label>
        <input type="text" class="form-control" id="challengeAnswer">
      </div>
    </section>
</template>
  
<script>
  import { computed, onMounted } from 'vue'
  import Pop from "../../utils/Pop.js"
  import { logger } from "../../utils/Logger.js"  
  import { Challenge } from '../../models/Challenge.js'
  
  export default {
    props: {
      challenge: {
        type: Challenge || Object,
        required: true
      }
    },
    components: {

    },
    setup() {

      onMounted(() => {

      })
      return {

      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>
