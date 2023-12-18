<template>
  <div class="my-2 my-md-0 d-flex flex-row align-items-center justify-content-center" :class="props.themeStyle ? 'theme-card' : 'card'" :style="{backgroundColor: props.bgColor, border: '1px', borderColor: props.color, borderStyle: 'solid'}">

    <i class="mdi fs-1" :class="props.icon, props.leftAlignedIcon ? 'order-1 pe-3' : 'order-2 ps-3', props.themeStyle ? 'theme-text' : ''" :style="[props.themeStyle ? {'color': '#F2FAC4'} : {'color': props.color}]"></i>

    <div class="d-flex flex-column justify-content-center" :class="props.leftAlignedIcon ? 'order-2' : 'order-1 text-center fs-4'">
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
    icon: {type: String, required: true},
    leftAlignedIcon: {type: Boolean, required: true, default: true},
    themeStyle: {type: Boolean, required: true, default: false}
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

.theme-text{
  text-shadow: 0px 0px 15px #cbd4a57b;
}

.theme-card{
  color: white;
  padding: .75rem;
  font-family: 'Lekton', sans-serif;
  font-size: large;
  font-weight: bold;
  border-radius: .5rem;
  height: 7rem;
}
</style>