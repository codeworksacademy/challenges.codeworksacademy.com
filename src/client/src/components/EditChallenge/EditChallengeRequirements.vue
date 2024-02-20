<template>
  <section v-if="challenge" class="px-2 mb-4">
    <div class="input-group mb-3">
      <input v-model="editable.type" type="text" class="form-control" placeholder="Add a Requirement">
      <label for="newRequirement" class="input-group-text btn-success btn" @click="addRequirement">Add Requirement</label>
    </div>
    <div class="input-group my-3" v-for="(requirement, index) in requirements" :key="index">
      <input type="text" class="form-control" :value="requirement" @input="updateRequirement($event, index)">
      <label for="" class="input-group-text btn-danger btn" @click="deleteRequirement(index)">Delete</label>
    </div>
  </section>
</template>
    
<script>
import { ref, watchEffect } from 'vue'
import { logger } from '../../utils/Logger.js'
import { Challenge } from '../../models/Challenge.js'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup(props) {
    const requirements = ref([])
    const editable = ref({
      type: '',
    })

    watchEffect(() => {
      requirements.value = props.challenge.requirements
    })

    async function addRequirement() {
      logger.log("Adding requirement", editable.value.type)
      requirements.value.push(editable.value.type)
      editable.value.type = ''
    }

    const updateRequirement = ($event, index) => {
      requirements.value[index] = $event.target.value
    }

    async function deleteRequirement(index) {
      logger.log("Deleting requirement", requirements.value[index])
      requirements.value.splice(index, 1)
      editable.value.type = ''
    }

    return {
      editable,
      addRequirement,
      updateRequirement,
      deleteRequirement,
      requirements
    }
  }
}
</script>
  
<style scoped lang="scss"></style>