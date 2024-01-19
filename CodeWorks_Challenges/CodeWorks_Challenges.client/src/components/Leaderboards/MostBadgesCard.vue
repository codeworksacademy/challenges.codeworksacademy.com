<template>
  <section v-if="participant" :key="participant?.id" class="container-fluid">
    <div class="col-12 badge-card d-flex justify-content-around align-items-center text-white my-0 pe-2 py-2 border">
      <span class="col-4 d-flex justify-content-start align-items-center">
        <div class="col-7 pe-2">{{ participant.profile.name }}</div>
        <router-link class="col-2 d-flex justify-content-center ps-2" :to="{ name: 'Profile.overview', params: { profileId: participant.accountId } }">
          <img
            :src="participant.profile.picture"
            :title="`Click to Visit ${participant.profile.name}'s Profile Page`"
            class="img-fluid profile-picture rounded-circle img-fluid selectable"
            height="35"
            width="35"
          />
        </router-link>
      </span>
      <span class="col-3 text-center">Badge Count: {{ participant.badges.length }}</span>
      <span class="col-3 text-end text-capitalize pe-4">
        View Badges: 
        <i
          @click="viewBadges"
          role="button"
          class="mdi mdi-dots-grid"
          data-bs-toggle="modal"
          data-bs-target="#badgeModal"
          :title="`View ${participant.profile.name}'s Badges`"
        >
        </i>
      </span>
    </div>
  </section>
</template>

<script>
import { ChallengeParticipant } from '../../models/ChallengeParticipant';
import { logger } from "../../utils/Logger.js";
import { Modal } from "bootstrap";

export default {
  props: {
    participant: {
      type: ChallengeParticipant || Object,
      required: true
    }
  },
  setup() {
    function viewBadges() {
      try {
        Modal.getOrCreateInstance('#badgeModal').show()
      } catch (error) {
        logger.error(error);
      }
    }
    return { 
      viewBadges
    }
  }
}
</script>

<style scoped lang="scss">
.badge-card {
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
    max-height: 35px;
    max-width: 35px;
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