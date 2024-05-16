<template>
  <div class="container-fluid">
    <section class="row bg-detail mb-4 py-3 px-1 rounded-3" v-if="challenge">
      <div class="col-12 text-light">
        <h3 class="fs-2 pb-3" style="color: #7A7A7A">Challenge Requirements</h3>
        <h4 v-if="challenge.requirements?.length == 0" class="text-light">No requirements</h4>
        <ol v-else-if="isParticipant?.requirements.length > 0">
          <li v-for="(requirement, index) in isParticipant.requirements" :key="index" class="py-2">
            <input type="checkbox" class="form-check-input mx-2" :name="index" :checked="requirement.isComplete" disabled>
            <span class="ms-1">{{ requirement.description }}</span>
          </li>
        </ol>
        <ol v-else>
          <li v-for="(requirement, index) in challenge?.requirements" :key="index" class="py-2">
            <span>{{ requirement }}</span>
          </li>
        </ol>
      </div>
    </section>
    <section class="row bg-detail py-3 px-1 rounded-3" v-if="isParticipant && challenge">
      <div class="col-12 text-light">
        <h3 class="fs-2 pb-3 text-warning" style="color: #7A7A7A">Feedback</h3>
        <div class="d-flex" v-if="isParticipant.feedback.length > 0">
            <ul>
              <li v-for="feedback in isParticipant.feedback">
                  <div class="d-flex align-items-center gap-3 flex-wrap">
                    <div class="d-flex align-items-center gap-2" :alt="feedback.createdAt">
                      <i class="mdi mdi-check-circle text-secondary fs-3" v-if="feedback.returnedStatus == 'completed'"></i>
                      <i class="mdi mdi-close-circle-outline text-danger fs-3" v-else></i>
                      <span class="text-capitalize">{{ feedback.returnedStatus }}</span>:
                    </div>
                    <!-- <div class="d-flex align-items-center" v-if="feedback.moderator">
                      boop
                      <img :src="feedback.moderator.picture" :alt="feedback.moderator.nickname || feedback.moderator.name" class="avatar-sm">
                    </div> -->
                    <span>{{ feedback.comment }}</span>
                  </div>
              </li>
            </ul>
        </div>
        <div class="d-flex" v-else>
          <p class="fs-5"> {{( isParticipant.status == 'completed' ? 'Congratulations!' : 'Please submit your challenge' )}} </p>
        </div>
      </div>
    </section>
  </div>
</template>
  
<script>
import { computed } from 'vue'
import { AppState } from '../AppState.js'

export default {
  setup() {
    return {
      challenge: computed(() => AppState.ChallengeState.challenge),
      isParticipant: computed(() => AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)),
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
}

li {
  font-size: 1.2rem;
}

.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}
</style>