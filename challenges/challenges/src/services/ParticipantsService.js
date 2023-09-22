import { dbContext } from "../db/DbContext.js";
import { BadRequest } from "../utils/Errors.js";

class ParticipantsService {

  async createParticipant(newParticipant) {
    const participant = await dbContext.Participants.create(newParticipant)
    await participant.populate('profile challenge')
    return participant
  }

  async getParticipantById(participantId) {
    const participant = await dbContext.Participants.findById(participantId)
    .populate('profile challenge')
    if (!participant) {
      throw new BadRequest("No one has joined this challenge yet")
    }
    return participant
  }

  async removeParticipant(participantId, userId) {
    const participant = await this.getParticipantById(participantId)
    if (participant.accountId != userId) {
      throw new BadRequest("🛑 [UNAUTHORIZED] Moderator / Challenge Creator Privileges Required 🛑")
    }
  }
}

export const participantsService = new ParticipantsService()