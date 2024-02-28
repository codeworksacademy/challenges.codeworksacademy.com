<template>
  <section class="px-2 mb-4" v-if="challenge">
    <div class="input-box input-group mb-3">
      <label class="input-group-text" for="challengeName">Challenge Name</label>
      <input type="text" class="form-control" id="name" name="name" v-model="challenge.name">
    </div>
    <div class="input-box input-group mb-3">
      <label class="input-group-text" for="coverImg">Cover Image</label>
      <input type="text" class="form-control" id="coverImg" name="coverImg" v-model="challenge.coverImg">
    </div>
    <img :src="challenge.coverImg" alt="" class="w-100 img-fluid rounded mb-3"
      style="height: 175px; object-position: center; object-fit: cover;">
    <div class="input-group mb-3">
      <label class="input-group-text" for="challengeCategory">Category</label>
      <select class="input-box form-select text-center" id="challengeCategory" v-model="challenge.category">
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
      <select class="input-box form-select text-center" id="challengeDifficulty" v-model="challenge.difficulty">
        <option selected>Choose Difficulty</option>
        <option value="1">Easy</option>
        <option value="2">Medium</option>
        <option value="3">Hard</option>
      </select>
    </div>
    <div class="input-group mb-3">
      <label class="input-group-text" for="challengeStatus">Status</label>
      <select class="input-box form-select text-center" id="challengeStatus" v-model="challenge.status">
        <option value="draft" class="">Draft</option>
        <option value="under review" class="">Under Review</option>
        <option value="published" class="">Published</option>
        <option value="deprecated" class="">Deprecated</option>
      </select>
    </div>
    <div class="input-group mb-3">
      <label class="input-group-text" for="challengeAutoGrade">Auto Grade</label>
      <select id="challengeAutoGrade" class="input-box form-select" v-model="challenge.autoGrade">
        <option :value=false>No</option>
        <option :value=true>Yes</option>
      </select>
    </div>
    <div class="input-box input-group mb-3">
      <label class="input-group-text" for="challengeAnswer">Answer</label>
      <input type="text" class="form-control" id="challengeAnswer" v-model="challenge.answer"
        :disabled="!challenge.autoGrade" :placeholder="!challenge.autoGrade ? 'Please specify requirements below' : ''">
    </div>
  </section>
</template>
  
<script>
import { Challenge } from '../../models/Challenge.js'

export default {
  props: {
    challenge: {
      type: [Challenge, Object],
      required: true
    }
  }
}
</script>

<style scoped lang="scss"></style>