<template>
  <img :src="props.picture" :alt="props.name" class="avatar-lg mx-4 light-gold-border avatar-style">
  <div class="d-flex flex-column">
    <p class="fs-2 m-0">
      {{ props.name }}
    </p>
    <p class="fs-6 d-none d-md-block">
      <span class="light-gold-color">Rank: </span> {{ props.currentRank }}
      <span title="experience" class="ms-4">
        {{ props.rank }} <span class="light-gold-color">XP</span>
      </span>
      <span title="challenges" class="ms-4">
        {{ props.challengesCount }}
        <i class="mdi mdi-file-code light-gold-color"></i>
      </span>
      <span title="reputation" class="ms-4">
        {{ props.reputation }} <i class="mdi light-gold-color mdi-emoticon-happy"></i>
      </span>
    </p>
  </div>
</template>


<script>

export default {
  props:{
    name: {type: String, required: true},
    picture: {type: String, required: true},
    rank: {type: String, required: true},
    challengesCount: {type: String, required: true},
    reputation: {type: String, required: true},
    currentRank: {type: String, required: true}
  },
  setup(props){
    return {
      props
    }
  }
}
</script>


<style lang="scss" scoped>
.avatar-style {
  position: relative;
  top: -5.5vh;
}
</style>
