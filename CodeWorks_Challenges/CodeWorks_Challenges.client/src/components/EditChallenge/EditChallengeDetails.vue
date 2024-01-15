<template>
  <section class="container-fluid" v-if="challenge">
    <div class="input-box form-group mb-3">
      <input type="text" class="form-control" id="name" name="name" v-model="challenge.name">
      <label class="form-control" for="challengeName">Challenge Name</label>
    </div>
    <div class="input-box form-group mb-3">
      <input type="text" class="form-control" id="coverImg" name="coverImg" v-model="challenge.coverImg">
      <label class="form-control" for="coverImg">Cover Image</label>
    </div>
    <img :src="challenge.coverImg" alt="" class="w-100 img-fluid rounded mb-3">
    <div class="input-group mb-3">
      <label class="form-select" for="challengeCategory">Category</label>
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
      <label class="form-select" for="challengeDifficulty">Difficulty</label>
      <select class="input-box form-select text-center" id="challengeDifficulty" v-model="challenge.difficulty">
        <option selected>Choose Difficulty</option>
        <option value="1" class="bg-success">Easy</option>
        <option value="2" class="bg-warning">Medium</option>
        <option value="3" class="bg-danger">Hard</option>
      </select>
    </div>
    <div class="input-group mb-3">
      <label class="form-select" for="challengeStatus">Status</label>
      <select class="input-box form-select text-center" id="challengeStatus" v-model="challenge.status">
        <option value="draft" class="">Draft</option>
        <option value="under review" class="">Under Review</option>
        <option value="published" class="">Published</option>
        <option value="deprecated" class="">Deprecated</option>
      </select>
    </div>
    <div class="input-group mb-3">
      <label class="form-control" for="challengeAutoGrade">Auto Grade</label>
      <select id="challengeAutoGrade" class="input-box form-select" v-model="challenge.autoGrade">
        <option value=false>No</option>
        <option value=true>Yes</option>
      </select>
    </div>
    <div class="input-box form-group mb-3">
      <input type="text" class="form-control" id="challengeAnswer" v-model="challenge.answer" :disabled="challenge.autoGrade == 'false' || challenge.autoGrade == false">
      <label class="form-control" for="challengeAnswer">Answer</label>
    </div>
  </section>
</template>
  
<script>
import { Challenge } from '../../models/Challenge.js'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import url('../../assets/scss/_formStyles.scss');
.input-box textarea:valid~label,
.input-box textarea:focus~label,
.input-box input[type="text"]:valid~label,
.input-box input[type="text"]:focus~label {
  position: absolute;
  top: -45px !important;
  left: 0;
  padding: 10px 0 0;
  margin-top: 10px;
  color: var(--text-main) !important;
  text-shadow: 0 .5px 0px var(--shadow-blue);
  font-size: 14px;
}
</style>
