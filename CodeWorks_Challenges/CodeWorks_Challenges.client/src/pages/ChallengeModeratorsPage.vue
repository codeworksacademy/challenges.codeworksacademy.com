<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12 d-flex flex-column">
        <div>
          This is the Moderators page for your challenge
        </div>
        <div>
          Here you can search for new moderators
          <div>
            <ModSearchForm />
          </div>
        </div>
      </div>
      <div class="col-12 d-flex flex-column">
        These are active challenge moderators
        <div v-for="moderator in moderators" :key="moderator.id">
          <div v-if="moderator.status == 'active' || moderator.status == 'CodeWorks'">
            {{ moderator.profile.name }}
            <img :src="moderator.profile.picture" alt="">
          </div>
        </div>
      </div>
      <div class="col-12 d-flex flex-column">
        These are the users that have been invited but have not accepted the invite
        <div v-for="moderator in moderators" :key="moderator.id">
          <div v-if="moderator.status == 'pending'">
            {{ moderator.profile.name }}
            <img :src="moderator.profile.picture" alt="">
          </div>
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
  components: { ModSearchForm }
}
</script>

<style lang="scss" scoped></style>