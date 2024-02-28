import { api } from './AxiosService.js'
import { AppState } from "../AppState.js"
import { logger } from './../utils/Logger.js';
import { Profile } from '../models/Profile.js';
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

class ParticipantsService {

  async getLeaderboards() {
    if (AppState.leaderboards.length) { return }

    const res = await api.get('api/participants/leaderboards');
    const profiles = res.data.map(p => new Profile(p));

    AppState.leaderboards = [
      {
        prop: 'rank',
        name: 'Top Rank',
        profiles: profiles.sort((a, b) => (b.rank - a.rank)).slice(0, 10)
      },
      {
        prop: 'xp',
        name: 'Most Experience',
        profiles: profiles.sort((a, b) => (b.xp - a.xp)).slice(0, 10)
      },
      {
        prop: 'reputation',
        name: 'Most Reputation',
        profiles: profiles.sort((a, b) => (b.reputation - a.reputation)).slice(0, 10)
      },
      // {
      //   name: 'Most Challenges Created',
      //   participants: participants.sort((a, b) => (b.reputation - a.reputation))
      // },
      // {
      //   name: 'Most Popular Challenges',
      //   participants: []
      // },
    ]
  }

  // NOTE not used anywhere yet
  // async getParticipantById(participantId) {
  //   const res = await api.get(`api/participants/${participantId}`)
  //   logger.log('[GETTING PARTICIPANT BY ID]', res.data)
  //   AppState.ChallengeState.participant = new ChallengeParticipant(res.data)
  // }

  async joinChallenge(newParticipant) {
    const res = await api.post('api/participants', newParticipant);
    logger.log('New participant:', res.data)
    const participant = new ChallengeParticipant(res.data);
    AppState.ChallengeState.participants.push(participant);
    AppState.AccountState.participation.push(participant);
    AppState.ChallengeState.challenge.participantCount++;
  }

  async leaveChallenge(participantId) {
    const res = await api.delete(`api/participants/${participantId}`);
    logger.log('Deleted participant:', res.data);
    let participantIndexC = AppState.ChallengeState.participants.findIndex(p => p.id === participantId);
    let participantIndexA = AppState.AccountState.participation.findIndex(p => p.id === participantId);
    AppState.ChallengeState.participants.splice(participantIndexC, 1);
    AppState.AccountState.participation.splice(participantIndexA, 1);

  }

  async getParticipantsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/participants`)
    AppState.ChallengeState.participants = res.data.map(p => new ChallengeParticipant(p))
    logger.log('[Participants in this challenge]:', AppState.ChallengeState.participants)
  }

  async getParticipationByUserId(userId) {
    const res = await api.get(`api/profiles/${userId}/participation`);
    const participation = res.data.map(p => new ChallengeParticipant(p));
    logger.log('[PARTICIPANTS SERVICE] getParticipationByUserId:: ', participation);
    AppState.AccountState.participation = participation;
  }
}

export const participantsService = new ParticipantsService()