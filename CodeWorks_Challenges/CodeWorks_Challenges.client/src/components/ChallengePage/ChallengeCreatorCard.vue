<template>
  <section :class="`creator-details-card ${themeStyle ? 'theme-style' : ''} rounded text-capitalize p-2 rounded-3`"
    :style="{ backgroundColor: bgColor, borderColor: color, borderStyle: 'groove', backgroundImage: `url(${challenge?.creatorCoverImg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }">
    <div class="card-body d-flex justify-space-evenly">
      <div class="col-4 d-flex flex-column justify-content-evenly align-items-center my-3">
        <router-link :to="{ name: 'Profile.overview', params: { profileId: challenge.creator.id } }">
          <img :src="challenge.creator.picture"
            :alt="`Image for Challenge creator named '${challenge.creator.name}' is broken`"
            :title="`Image of the Challenge Creator; ${challenge.creator.name}`" class="creator-img img-fluid rounded-circle me-2" style="height: 75px; width: 75px;">
        </router-link>
      </div>
      <div class="col-8 d-flex flex-column justify-content-evenly">
        <h3 :style="isMobile ? 'padding-left: 4rem;' : 'padding-left: 1.5rem;'"
          class="col-12 creator-text d-flex justify-content-center offset-1 text-capitalize"> {{ challenge.creator.name }}
        </h3>
        
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import Pop from '../../utils/Pop'
import { useRoute } from 'vue-router'
import { AppState } from '../../AppState'
import { Challenge } from '../../models/Challenge'
import { challengesService } from '../../services/ChallengesService'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    },
    bgColor: { type: String, required: true },
    color: { type: String, required: true },
    themeStyle: { type: Boolean, required: true, default: false }
  },
  setup(props) {
    const route = useRoute()
    const isMobile = computed(() => window.innerWidth < 768)

    const gaveReputation = computed(() => {
      const challenge = props.challenge
      if (challenge.reputationIds.find(r => r == AppState.AccountState.account.id)) {
        return true
      }
      return false
    })

    async function giveReputation() {
      try {
        const challengeId = props.challenge.id
        const accountId = AppState.AccountState.account?.id
        await challengesService.giveReputation(challengeId, accountId)
        if (gaveReputation.value) {
          Pop.toast(`The CodeWorks team and ${props.challenge.creator.name} appreciate you gifting +1 Reputation to challenge '${props.challenge.name}'!`, 'success')
        } else {
          Pop.toast(`You have removed your reputation point to ${props.challenge.creator.name} for '${props.challenge.name}.'`, 'success')
        }
      } catch (error) {
        Pop.error(error.message)
      }
    }

    return {
      route,
      isMobile,
      gaveReputation,
      giveReputation,
      canGiveReputation: computed(() => {
        if (props.challenge.reputationIds.find(r => r == AppState.AccountState.account.id)) {
          return false
        }
        return true
      })
    }
  }
}
</script>

<style scoped lang="scss">
.creator-details-card {
  position: relative;
  background-color: #00000080;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  opacity: .8;
  filter: brightness(1.3);
  z-index: 0;
  color: white;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: .6rem;
      color: white;
      padding: .25rem 0 0 .25rem;
      text-wrap: nowrap;
      background: linear-gradient(-45deg, #00000080 80%, #00000000);
      background-color: invert(#00000000);
      transition: .5s ease-in-out;
      border-radius: 5px;
      z-index: -1;
        >p {
          filter: drop-shadow(0 0 10px 0px #000000);
        }
      .creator-img {
        filter: brightness(.5);
      }
    }
}
</style>