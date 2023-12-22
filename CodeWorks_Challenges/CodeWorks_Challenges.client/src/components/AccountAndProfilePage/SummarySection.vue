<template>
  <img :src="props.picture" :alt="props.name" class="avatar-lg mx-4 light-gold-border avatar-style">
  <div class="d-flex flex-column">
    <p class="fs-2 m-0">
      {{ props.name }}
    </p>
    <p class="fs-6 hide-sm">
      <span class="light-gold-color">Rank: </span> {{ currentRank }}
      <span title="experience" class="ms-4">
        {{ props.rankNumber }} <span class="light-gold-color">XP</span>
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
import { computed } from 'vue'
import { AppState } from '../../AppState'


export default {
  props:{
    name: {type: String, required: true},
    picture: {type: String, required: true},
    rankNumber: {type: Number, required: true},
    challengesCount: {type: Number, required: true},
    reputation: {type: Number, required: true},
    userRank: {type: Number, required: true}
  },

  setup(props){
    return {
      props,

      currentRank: computed(() => {
        let lastKey = 0

        for (const key in AppState.rankTitles) {
          if (props.userRank >= key) {
            lastKey = key
          }
        }

        return AppState.rankTitles[lastKey]
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.avatar-style {
  position: relative;
  top: -5.5vh;
}

@media(max-width: 768px) {
  .avatar-lg{
  height: 5.5rem;
  width: 5.5rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}
}

@media(max-width: 391px){
  .hide-sm{
    display: none;
  }
}
</style>
