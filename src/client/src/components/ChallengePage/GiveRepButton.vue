<template>
	<div class="col-12 button-container d-flex justify-content-center align-items-center"
		v-if="isParticipant && !isCreator">
		<button v-if="!gaveReputation" @click="giveReputation()" class="me-3">
			<small>Give Reputation</small>
		</button>
		<button v-else @click="giveReputation()" class="remove-reputation-hover me-3">
			<small>Remove Reputation</small>
		</button>
	</div>
</template>

<script>
import { computed } from 'vue';
import { AppState } from '../../AppState.js';
import { Challenge } from '../../models/Challenge.js';
import { challengesService } from '../../services/ChallengesService.js';
import Pop from '../../utils/Pop.js';

export default {
	props: {
		challenge: { type: Challenge, required: true }
	},
	setup(props) {
		async function giveReputation() {
			try {
				const challengeId = props.challenge.id;
				const accountId = AppState.AccountState.account?.id;
				await challengesService.giveReputation(challengeId, accountId);
			}
			catch (error) { Pop.error('[GIVE REP BTN] giveReputation:: ' + error.message); }
		}
		return {
			giveReputation,
			gaveReputation: computed(() => props.challenge.reputationIds.find(r => r == AppState.AccountState.account.id)),
			isParticipant: computed(() => AppState.ChallengeState.participants.find(p => p.accountId === AppState.AccountState.account.id)),
			isCreator: computed(() => AppState.AccountState.account.id === props.challenge.creator.id),
		}
	}
}
</script>


<style lang="scss" scoped>
@import url('../../assets/scss/_challengeReputationButton.scss');

.details-card {

	@media screen and (min-width: 768px) and (max-width: 1200px) {
		.button-container {

			&:before,
			&:after {
				width: 35%;
				height: 67%;
				border-radius: 15%;
			}
		}
	}
}
</style>