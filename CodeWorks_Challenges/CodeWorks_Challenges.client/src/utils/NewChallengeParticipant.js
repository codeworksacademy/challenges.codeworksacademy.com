import { AppState } from '../AppState';

export function newChallengeParticipant(filterBy) {
  const { activeChallenge, activeParticipant } = AppState
  const participants = filterBy ? AppState.participants.filter(p => p.status === filterBy) : AppState.participants;
  const participant = participants.find(p => p.accountId === AppState.user.id);
  const CHALLENGE_PARTICIPANT_FIELDS = {
    ...activeParticipant,
    challenge: activeChallenge,
    accountId: participant?.accountId,
    challengeId: participant?.challengeId,
    submission: participant?.submission,
    status: participant?.status,
    feedback: participant?.feedback,
    requirements: participant?.requirements || [], 
  }
  return CHALLENGE_PARTICIPANT_FIELDS
}
