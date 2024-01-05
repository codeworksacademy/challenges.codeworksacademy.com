<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12 d-flex flex-column">
        <div>
          <span class="text-light">This is the Moderators page for your challenge</span>
        </div>
        <div>
          <span class="text-light">Here you can search for new moderators</span>
          <div class="my-3">
            <ModSearchForm />
          </div>
        </div>
      </div>
      <span class="text-light mb-3">These are active challenge moderators</span>
      <div v-for="moderator in moderators" :key="moderator.id">
        <div v-if="moderator.status == 'active' || moderator.status == 'CodeWorks'" class="text-light">
            <ChallengeModeratorCard :moderator="moderator" />
        </div>
      </div>
      <span class="text-light">These are the users that have been invited but have not accepted the invite</span>
      <div v-for="moderator in moderators" :key="moderator.id">
        <div v-if="moderator.status == 'pending'">
            <ChallengeModeratorCard :moderator="moderator" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import ModSearchForm from '../components/Forms/ModSearchForm.vue';
import Pop from '../utils/Pop';
import { useRoute } from 'vue-router';
import { challengeModeratorsService } from '../services/ChallengeModeratorsService';
import { AppState } from '../AppState';
import ChallengeModeratorCard from '../components/ChallengeModeratorCard.vue';

export default {
  setup() {
    const route = useRoute()

    async function getModeratorsByChallengeId() {
      try {
        const challengeId = route.params.challengeId
        await challengeModeratorsService.getModeratorsByChallengeId(challengeId)
      } catch (error) {
        Pop.error(error.message, '[getModeratorsByChallengeId - Challenge Moderators Page]')
      }
    }

    onMounted(() => {
      getModeratorsByChallengeId();
    })
    return {
      moderators: computed(() => AppState.moderators)
    };
  },
  components: { ModSearchForm, ChallengeModeratorCard }
}
</script>