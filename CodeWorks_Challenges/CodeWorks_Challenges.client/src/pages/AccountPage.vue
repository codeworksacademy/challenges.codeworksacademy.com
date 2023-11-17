<template>
  <div class="container-fluid" v-if="account.id">

    <section class="row">
      <div class="col-12 d-flex flex-column justify-content-center align-items-center">
        <h1>Grade Challenge</h1>
        <form @submit.prevent="submitGrade">
          <div class="col-12 form-group px-5 mb-5">
            <label for="grade">Grade</label>
            <input type="number" name="grade" id="grade" class="form-control input-box" v-model="grade" />
          </div>
          <div v-for="field in challengeFieldsToGrade" :key="field.requirement" class="d-flex flex-column px-5 py-1">
            <div class="col-12 form-group mt-3">
              <!-- <label for="requirements">Requirement</label> -->
              <div class="form-check">
                <input type="checkbox" class="form-check-input" v-model="field.requirement.completed" :id="`field-${field.requirement.step}`">
                <label class="form-check-label" :for="`field-${field.requirement.step}`">{{ field.requirement.step }}</label>
              </div>
            </div>
            <div class="col-12 form-group mt-1">
              <label for="comment">Comment</label>
              <textarea type="text" name="comment" id="comment" class="form-control input-box mt-1" placeholder="Leave some insight..." rows="1" v-model="field.requirement.comment" />
            </div>
          </div>
          <div class="form-check" v-for="field in challengeFieldsToGrade" :key="field.requirement.comment">
          </div>
          <div class="form-group">
            <label for="feedback">Feedback</label>
            <textarea type="text" name="feedback" id="feedback" class="form-control" v-model="feedback" />
          </div>
          <div class="form-group">
            <label for="completed">Completed</label>
            <input type="checkbox" name="completed" id="completed" class="form-control" v-model="completed" />
          </div>
          <button type="submit" class="btn btn-success">Submit</button>
        </form>
      </div>
    </section>
























    <section class="row p-4" style="background-color: #131923;">
      <div class="col-2">
        <img :src="account.picture" alt="" class="rounded-circle img-fluid w-75">
      </div>
      <div class="col-10">
        <div class="col-7 d-flex flex-column justify-content-center mt-2">
          <div class="d-flex flex-row">
            <div class="col-6 text-capitalize fw-500">
              <h5>{{ account.name }}</h5>
            </div>
            <div class="col-6 fw-600 subheader">
              #426580
            </div>
          </div>
          <div class="col-8 d-flex justify-content-start me-5">
            <i class="col-1 mdi mdi-diamond-outline fs-5"></i>
            <span class="col-2 fw-500 p-1">0</span>
            <i class="col-1 mdi mdi-table-account fs-5"></i>
            <span class="col-2 fw-500 p-1">0</span>
            <i class="col-1 mdi mdi-file-outline fs-5"></i>
            <span class="col-2 fw-500 p-1">0</span>
            <i class="col-1 mdi mdi-emoticon-outline fs-5"></i>
            <span class="col-2 fw-500 p-1">0</span>
          </div>
        </div>
      </div>
    </section>
    <section class="row mt-3 p-3" style="background-color: #161d2b;">
      <div class="col-8 d-flex justify-content-between align-items-center text-uppercase fw-500">
        <a href="">Profile</a>
        <a href="">Profile Settings</a>
        <a href="">Billing and Plans</a>
        <a href="">Create Team</a>
      </div>
    </section>
    <hr class="" style="color: #3d4450; margin-top: .1rem; margin-bottom: .1rem;">
    <section class="row p-3 mb-5">
      <div class="col-6 d-flex justify-content-between align-items-center text-uppercase fw-500">
        <a href="">Overview</a>
        <a href="">Activity</a>
        <a href="">Badges</a>
        <a href="">Certificates</a>
      </div>

    </section>
    <section class="row ps-3">
      <div class="col-9 bg-image d-flex justify-content-center align-items-center" :style="`background-image: url(${account.coverImg}); opacity: .9; background-repeat: no-repeat; background-size: cover;`">

        <div class="col-6">
          <div id="bugs-bunny" class="alt-badge bunny-pink">
            <div class="text-center">
            <div class="circle pt-1"> <i class="mdi mdi-rabbit"></i></div>
              <div class="double-ribbon-top lvl1-ribbon">Bugs</div>
              <div class="double-ribbon-bottom lvl1-ribbon">Bunny</div>
            </div>
          </div>
        </div>

        <div class="col-6">
          <h5>Bugs Bunny</h5>
          <p class="text-uppercase">Current Rank</p>
        </div>
      </div>

      <div class="col-3">
        <div class="card bg-dark p-3 shadow-lg">
          <h6 class="text-uppercase subheader">Rank Progress</h6>
          <p>0% towards Widget Weenie</p>
        </div>
      </div>
    </section>

    <section class="row px-5 pt-5 ms-3">
      <div class="col-5 card bg-dark d-flex justify-content-center align-items-center p-3 m-3">
          <div class="">
            <i class="mdi mdi-flag text-primary fs-3"></i>
          </div>
          <div class="">
            <i class="mdi mdi-source-commit-local fs-3"></i>
          </div>
          <p class="col-12 text-center text-uppercase">System Owns</p>
      </div>
      <div class="col-5 card bg-dark d-flex justify-content-center align-items-center p-3 m-3">
          <div class="">
            <i class="mdi mdi-emoticon text-info fs-3"></i>
          </div>
          <div class="">
            <i class="mdi mdi-source-commit-local fs-3"></i>
          </div>
          <p class="col-12 text-center text-uppercase">Respect</p>
      </div>
    </section>

    <section class="row mb-5 pb-5">
      <div style="height: 1000px;"></div>
    </section>














    <section class="row mt-5 pt-5">
      <div class="p-0">
        <img class="coverImg-style" :src="account.coverImg" alt="Cover Image">
      </div>
      
      <div class="d-flex col-md-10 col-12">
        <img :src="account.picture" :alt="account.name" class="avatar-md mx-4 avatar-style">
        <div class="d-flex flex-column">
          <p class="fs-2 m-0">
            {{ account.name }}
          </p>
          <p>
            Rank: {{ account.title }} 
            <span class="ms-2">
              {{ account.rank }} XP
            </span>
            <span title="challenges" class="ms-2">
              {{ (myChallenges.length + joinedChallenges.length) }}
              <i class="mdi mdi-head-lightbulb fs-5"></i>
            </span>
          </p>
        </div>
      </div>

      <div class="col-md-2 col-12 text-md-end">
        <button type="button" class="btn btn-primary my-2 ms-md-0 ms-2" data-bs-toggle="modal" data-bs-target="#accountFormModal">
          Edit Account
        </button>
      </div>
    </section>

<!-- TODO Add computed in Style section which sets the width of the progress bar (i.e., percentile based on next rank and current rank) -->
    <section class="rank-card-style bg-dark text-light row m-2 mb-3 p-2 rounded">
      <div class="col-12 fs-2">
        {{ account.title }}
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-md-3 col-12 d-flex align-items-end">
            <span>
              CURRENT RANK
            </span>
          </div>
          <div class="col-md-9 col-12 text-start text-md-end">
            <span>
              NEXT RANK [RANK NUMBER]
            </span>
            <div class="progress" role="progressbar" aria-label="example" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar bg-primary" style="width: 50%"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="row mb-3">
      <div class="col-12">
        <h4>
          Challenges Owned:
        </h4>
        <h5 v-if="myChallenges.length === 0">You haven't made any challenges</h5>
        <div v-else v-for="challenge in myChallenges" :key="challenge.id" class="col-12 mb-1 position-relative">
          <ChallengeCard :challenge="challenge" />
        </div>
      </div>
    </section>

    <section class="row mb-3">
      <AccountModerator />
    </section>

    <section class="row mb-3">
      <div class="col-12">
        <h4>
          Challenges Joined:
        </h4>
        <h5 v-if="joinedChallenges.length === 0">You haven't joined any challenges</h5>
        <div v-else v-for="challenge in joinedChallenges" :key="challenge.id" class="mb-1">
          <ChallengeCard :challenge="challenge.challenge" />
        </div>
      </div>
    </section>

    <section class="row mb-3">
      <div class="col-12">
        <h4>
          Challenges Completed:
        </h4>
        <h5 v-if="completedChallenges.length === 0">You haven't completed any challenges</h5>
        <div v-else v-for="challenge in completedChallenges" :key="challenge.id">
          <ChallengeCard :challenge="challenge" />
        </div>
      </div>
    </section>

    <section class="row my-2">
      <div>
        <a class="btn btn-primary" data-bs-toggle="collapse" href="#milestonesTracker" role="button" aria-expanded="false" aria-controls="milestonesTrackerToggle">Toggle Milestones Tracker</a>
      </div>
      <div class="collapse" id="milestonesTracker">
        <MilestonesTracker />
      </div>
    </section>
  </div>

  <div class="container-fluid" v-else>
    <h1 class="fs-1 fw-bold">
      Loading... <i class="mdi mdi-loading mdi-spin"></i>
    </h1>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="accountFormModal" tabindex="-1" aria-labelledby="accountFormModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="accountFormModalLabel">Edit Account</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <AccountForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { AppState } from '../AppState';
import AccountForm from "../components/AccountForm.vue";
import Pop from "../utils/Pop.js";
import { challengesService } from "../services/ChallengesService.js";
import { logger } from "../utils/Logger.js";
import ChallengeCard from '../components/ChallengeCard.vue'
import { moderatorsService } from "../services/ModeratorsService.js";
import AccountModerator from "../components/AccountModerator.vue";
import { participantsService } from "../services/ParticipantsService.js";
import { accountService } from "../services/AccountService.js";



import { GRADE_FIELDS } from "../constants/index.js"

export default {
  setup() {

    const grade = ref(0)
    const feedback = ref("")
    const completed = ref(false)
    const challengeFieldsToGrade = ref([])

    // Initialize challengeFieldsToGrade with the correct structure
    onMounted(() => {
      challengeFieldsToGrade.value = GRADE_FIELDS.map(field => ({
        requirement: field.requirement,
        completed: false
      }))
    })

    const challenge = computed(() => {
      return AppState.challenges.find(c => c.id === AppState.activeChallenge.id)
    })
    const participant = computed(() => {
      return AppState.participants.find(p => p.id === AppState.activeParticipant.id)
    })

    async function submitGrade() {
      try {
        const newSubmission = {
          grade: grade.value,
          feedback: feedback.value,
          completed: completed.value,
          challengeId: challenge.value.id,
          participantId: participant.value.id,
          requirements: challengeFieldsToGrade.value
        }
        await challengesService.submitChallengeForGrading(newSubmission, participant.value.id)
      } catch (error) {
        logger.error(error)
      }
    }






    async function getMyChallenges() {
      try {
        logger.log(AppState.account.id)
        await challengesService.getMyChallenges(AppState.account.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }

    async function getMyBadges() {
      try {
        await badgesService.getMyBadges(AppState.account.id)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }

    async function getParticipantsByAccount() {
      try {
        await accountService.getMyParticipations()
      } catch (error) {
        Pop.toast(error, 'error')
      }
    }

    watchEffect(() => {
      if (AppState.account.id) {
        getMyChallenges()
        getMyBadges()
        getParticipantsByAccount()
      }
    })
    return {
      grade,
      feedback,
      completed,
      challengeFieldsToGrade,
      challenge,
      participant,
      submitGrade,






      account: computed(() => AppState.account),
      // challenge: computed(() => AppState.activeChallenge),
      myChallenges: computed(() => AppState.myChallenges),
      joinedChallenges: computed(() => AppState.myParticipants),
      completedChallenges: computed(() => []),
    };
  },
  components: { AccountForm, ChallengeCard, AccountModerator }
}
</script>

<style scoped>

.container-fluid {
  background-color: #161d2b;
}

a {
  color: #9f9f9f;
  &:active {
    color: #f0f0f0;
  }
}
.bg-image {
  border-radius: .5rem;
  position: relative;
  &::before {
    content: '';
    background: linear-gradient(90deg, #00000090 0%, transparent 150%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: .5rem;
    z-index: -1;
  }

  &:hover {
    box-shadow: var(--shadow-magenta);
  }
}
.card {
  background-color: #161d2b;
  border-radius: .5rem;
}
.rank-card-style{
  height: fit-content;
}
.coverImg-style{
  object-fit: cover;
  object-position: center;
  height: 15vh;
  width: 100%;
}

.avatar-style{
  position: relative;
  top: -5.5vh;
}
</style>
