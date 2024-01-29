<template>
  <div :key="participant?.id" :class="`number-${index}-trophy`"
    class="col-12 score-card d-flex gap-3 justify-content-between align-items-center p-2 border">

    <div class="d-flex gap-3 align-items-center">
      <span class="fs-5">{{ index }}.</span>
      <router-link :to="{ name: 'Profile.overview', params: { profileId: participant.accountId } }">
        <img :src="participant.profile.picture"
          @error="(e) => e.target.src = `https://ui-avatars.com/api/?name=${participant.profile.name}&background=random`"
          :title="`Click to Visit ${participant.profile.name}'s Profile Page`"
          class="img-fluid profile-picture rounded-circle img-fluid selectable" height="35" width="35" />
      </router-link>
      <span class="">{{ participant.profile.name }}</span>
    </div>
    <div>
      <span class="text-center text-uppercase">{{ board.prop }} {{ participant.profile[board.prop] }}</span>
      <span class="text-end text-capitalize" v-if="participant.profile.title">Title: {{
        participant.profile.title
      }}</span>
    </div>
  </div>
</template>

<script>
import { ChallengeParticipant } from "../../models/ChallengeParticipant.js";

export default {
  props: {
    participant: {
      type: ChallengeParticipant,
      required: true,
    },
    index: {
      type: Number,
      required: true,
      default: 0
    },
    board: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
#number-1-player>.number-1-trophy {
  &:after {
    content: '';
    position: absolute;
    top: 6px;
    left: 2px;
    width: 100%;
    height: 75%;
    font-size: 2rem;
    padding: 0 0px;
    background-image: url('../../assets/img/gold.png');
    background-repeat: no-repeat;
    background-size: contain;
    filter: brightness(1.25);
    text-shadow: 2px 2px 2px var(--border-dark);
    opacity: 1;
  }
}

#number-2-player>.number-2-trophy {
  &:after {
    content: '';
    position: absolute;
    top: 6px;
    left: 2px;
    width: 100%;
    height: 75%;
    font-size: 2rem;
    padding: 0 0px;
    background-image: url('../../assets/img/silver.png');
    background-repeat: no-repeat;
    background-size: contain;
    text-shadow: 2px 2px 2px var(--border-dark);
    opacity: 1;
  }
}

#number-3-player>.number-3-trophy {
  &:after {
    content: '';
    position: absolute;
    top: 6px;
    left: 2px;
    width: 100%;
    height: 75%;
    font-size: 2rem;
    padding: 0 0px;
    background-image: url('../../assets/img/bronze.png');
    background-repeat: no-repeat;
    background-size: contain;
    text-shadow: 2px 2px 2px var(--border-dark);
    opacity: 1;
  }
}

.score-card {
  position: relative;
  opacity: .85;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 1px);
    background: #00000050;
  }

  .profile-picture {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    border: 1px solid var(--border-dark);
    aspect-ratio: 1/1;
  }

  span {
    display: inline-block;
    color: var(--text-main) !important;
    text-shadow: 2px 2px 2px var(--border-dark);
    z-index: 1;
  }
}
</style>