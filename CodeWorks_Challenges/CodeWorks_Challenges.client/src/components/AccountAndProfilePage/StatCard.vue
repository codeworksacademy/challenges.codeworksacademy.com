<template>
  <div class="card my-3 my-md-0 d-flex flex-row align-items-center justify-content-center" :style="{backgroundColor: props.bgColor, border: '1px', borderColor: props.color, borderStyle: 'solid' }">
    <i class="mdi pe-3 fs-1" :class="props.icon" :style="{color: props.color}"></i>
    <div class="d-flex flex-column justify-content-center">
      <span>{{ props.number }}</span>
      <span>{{ props.title }}</span>
    </div>
  </div>
</template>


<script>
export default {
  props:{
    bgColor: {type: String, required: true},
    color: {type: String, required: true},
    title: {type: String, required: true},
    number: {type: String, required: true},
    icon: {type: String, required: true}
  },

  setup(props){
    return {
      props
    }
  }
}
</script>


<style lang="scss" scoped>
.card{
    color: white;
    padding: .5rem;
    font-family: 'Lekton', sans-serif;
    font-size: large;
    font-weight: bold;
    border-radius: .5rem;
    height: 6rem;
  }
</style>