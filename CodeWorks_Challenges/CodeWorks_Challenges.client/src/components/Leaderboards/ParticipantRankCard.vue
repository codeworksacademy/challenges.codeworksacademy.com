<template>
  <div v-if="participant" :key="participant?.id" class="col-12 score-card d-flex justify-space-evenly align-items-center text-white my-0 pe-2 py-2 border">
    <span :class="`number-${index}-trophy`"></span>
    <span class="m-auto ps-4 fw-semibold" style="font-size: 1.1rem;">{{ index }}</span>
    <span class="col-4 d-flex justify-content-start align-items-center">
      <div class="col-7">{{ participant.profile.nickname || profile.name }}</div>
      <router-link class="col-2" :to="{ name: 'Profile.overview', params: { profileId: participant.accountId } }">
        <img
          :src="participant.profile.picture"
          :title="`Click to Visit ${participant.profile.nickname || profile.name}'s Profile Page`"
          class="img-fluid profile-picture rounded-circle img-fluid selectable"
          height="35"
          width="35"
        />
      </router-link>
    </span>
    <span class="col-3 text-center">Rank: {{ participant.profile.rank }}</span>
    <span class="col-3 text-end text-capitalize pe-4">Title: "{{ participant.profile.title }}"</span>
  </div>
</template>

<script>
import { ChallengeParticipant } from "../../models/ChallengeParticipant.js";

export default {
  props: {
    participant: {
      type: ChallengeParticipant || Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
      default: 0
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