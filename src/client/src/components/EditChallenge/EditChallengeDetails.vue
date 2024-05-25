<template>
  <section class="px-2 mb-4" v-if="challenge">
    <div class="input-box input-group mb-3">
      <label class="input-group-text" for="challengeName">Challenge Name</label>
      <input type="text" class="form-control" id="name" name="name" v-model="challenge.name">
    </div>
    <div class="input-box input-group mb-3">
      <label class="input-group-text" for="coverImg">Cover Image</label>
      <input type="url" class="form-control" id="coverImg" name="coverImg" @input="previewCoverImg" v-model="challenge.coverImg">
    </div>
    <div v-if="loadedCoverImg" class="coverImg-container rounded mb-3">
      <img :src="loadedCoverImg" alt="Challenge Cover Image" class="coverImg rounded-3">
    </div>
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
        <option :value="false">No</option>
        <option :value="true">Yes</option>
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
import { ref, watch } from 'vue'
import { Challenge } from '../../models/Challenge'

export default {
  props: {
    challenge: {
      type: [Challenge, Object],
      required: true
    }
  },
  data(props) {
    const loadedCoverImg = ref(null)

    watch(() => props.challenge.coverImg, () => {
      loadedCoverImg.value = props.challenge.coverImg
    })
    return {
      loadedCoverImg,
      previewCoverImg(e) {
        loadedCoverImg.value = e.target.value
      }
    }
  }
}

</script>

<style scoped lang="scss">
.coverImg-container {
  background: radial-gradient(circle at center center, rgba(85, 21, 21, 0) 0%, #151d2b 80%, #151d2b 100%);
  .coverImg {
    position: relative;
    left: 30%;
    transform: translateX(-50%);
    width: 100%;
    height: 250px;
    object-fit: fill;
    opacity: 0;
    animation: slideLeft 1s ease-out forwards;
  }
  @keyframes slideLeft {
    0% {
      transform: scale(0.9) rotate(-5deg);
      filter: blur(3px) brightness(0.5);
    }
    50% {
      transform: translateX(10%) rotate(0);
      opacity: 0.1;
    }
    100% {
      left: 0;
      transform: scale(1) translateX(0);
      opacity: 1;
      filter: blur(0) brightness(1);
    }
  }
}
</style>