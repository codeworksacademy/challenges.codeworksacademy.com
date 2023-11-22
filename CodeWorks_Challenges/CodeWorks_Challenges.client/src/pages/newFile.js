import { computed, onMounted, ref } from 'vue';
import { AppState } from '../AppState';
import Pop from "../utils/Pop.js";
import { logger } from "../utils/Logger.js";
import { challengesService } from '../services/ChallengesService';
import { useRoute } from 'vue-router';
import { participantsService } from '../services/ParticipantsService';
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js";
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js";

export default (await import('vue')).defineComponent({
components: {
// SubmissionCard,
GradeSubmissionForm,
ParticipantCard
},
setup() {
let route = useRoute();

const filterBy = ref('');
const editable = computed(() => newChallengeParticipant({ state: AppState }, filterBy.value)
);

async function setActiveChallenge() {
try {
await challengesService.setActiveChallenge(route.params.challengeId);
logger.log(route.params.challengeId);
} catch (error) {
logger.error(error);
Pop.toast(error, 'error');
}
}

async function getParticipantsByChallengeId() {
try {
const challengeId = route.params.challengeId;
await participantsService.getParticipantsByChallengeId(challengeId);
} catch (error) {
logger.error(error);
Pop.toast(error, 'error');
}
}

// async function submitGrade() {
//   try {
//   } catch (error) {
//     logger.error(error)
//     Pop.toast(error, 'error')
//   }
// }
function isModeratorStatus() {
const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id);
if (isMod) {
if (isMod.status == false) {
return 'pending';
} else return 'approved';
} else return 'null';
}



const challenge = computed(() => {
return AppState.challenges.find(c => c.id === AppState.activeChallenge.id);
});
const participant = computed(() => {
return AppState.participants.find(p => p.accountId === AppState.account.id);
});



onMounted(() => {
setActiveChallenge();
getParticipantsByChallengeId();
});

return {
filterBy,
editable,
challenge,

user: computed(() => AppState.user),
challenge: computed(() => AppState.activeChallenge),
// challengeRequirements,
myModerations: computed(() => AppState.moderators.filter(m => m.accountId === AppState.account.id)),
participant,
participantFilter: computed(() => {
if (!filterBy.value) {
return AppState.participants;
} else {
return AppState.participants.filter(p => p.status === filterBy.value);
}
}),
// challenge: computed(() => AppState.activeChallenge),
challengeCreator: computed(() => AppState.user.id === AppState.activeChallenge?.creatorId),
isModeratorStatus,
isParticipant: computed(() => {
return AppState.participants.find(p => p.accountId === AppState.account.id);
}),
difficulty: computed(() => StrDifficultyNum(AppState.activeChallenge.difficulty)
),
};
}
});
