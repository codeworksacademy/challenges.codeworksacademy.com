<template>
    <section class="container-fluid mb-3">
      <div class="form-floating">
        <textarea v-model="challenge.description" class="form-control" placeholder="Challenge Description" id="challengeDescriptionTextArea" style="height: 300px"></textarea>
      </div>
    </section>
</template>
  
<script>
  import {Challenge} from '../../models/Challenge'
  
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
  
  </style>
