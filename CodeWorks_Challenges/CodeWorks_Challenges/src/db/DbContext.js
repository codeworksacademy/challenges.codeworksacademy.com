import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ChallengeSchema } from '../models/Challenge';
import { ChallengeParticipantSchema } from '../models/Participant';
import { ModeratorSchema } from "../models/Moderator.js";
import { MilestoneSchema } from "../models/Milestone.js";
import { AccountMilestoneSchema } from "../models/AccountMilestone.js";

class DbContext {
  Account = mongoose.model('Account', AccountSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  Participants = mongoose.model('Participant', ChallengeParticipantSchema);
  Moderators = mongoose.model('Moderator', ModeratorSchema);
  Milestones = mongoose.model('Milestone', MilestoneSchema);
  AccountMilestones = mongoose.model('AccountMilestone', AccountMilestoneSchema);
}

export const dbContext = new DbContext()
