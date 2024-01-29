<template>
	<div class="col-12 button-container d-flex justify-content-center align-items-center" v-if="isParticipant">
		<button v-if="!gaveReputation" @click="giveReputation(1)" class="me-3">
			<small>Give Reputation</small>
		</button>
		<button v-else @click="giveReputation(0)" class="remove-reputation-hover me-3">
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
		async function giveReputation(up) {
			try {
				const challengeId = props.challenge.id;
				const accountId = AppState.AccountState.account?.id;
				await challengesService.giveReputation(challengeId, accountId);
			}
			catch (error) {
				Pop.error(error.message);
			}
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
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;

	.mdi-account-star-outline {
		position: relative;
		top: 20%;
		font-size: 3rem;
		transform: translateX(-10%);
	}

	.circle-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: end;
		align-items: center;

		.circle {
			position: absolute;
			top: 0;
			right: 35%;
			transform: translateY(-85%);
			display: flex;
			justify-content: center;
			align-items: center;
			width: 30px;
			height: 30px;
			box-shadow: inset 0 0 2px 2px #1c5b2f99;
			border-radius: 50%;
			background-color: #38BB64;
			color: white;
			font-size: 1.1rem;
			display: flex;
			justify-content: center;
			align-items: center;

			@media screen and (max-width: 1200px) {
				right: 15%;
			}

			@media screen and (max-width: 992px) {
				right: 5%;
			}
		}
	}

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