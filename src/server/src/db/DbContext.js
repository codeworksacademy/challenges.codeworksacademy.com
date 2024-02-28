import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ChallengeSchema } from '../models/Challenge';
import { ChallengeParticipantSchema } from '../models/ChallengeParticipant';
import { ChallengeModeratorSchema } from "../models/ChallengeModerator.js";
import { MilestoneSchema } from "../models/Milestone.js";
import { AccountMilestoneSchema } from "../models/AccountMilestone.js";

class DbContext {
  Account = mongoose.model('Profile', AccountSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  ChallengeParticipants = mongoose.model('Challenge_Participant', ChallengeParticipantSchema);
  ChallengeModerators = mongoose.model('Moderator', ChallengeModeratorSchema);

  Milestones = mongoose.model('Milestone', MilestoneSchema);
  AccountMilestones = mongoose.model('AccountMilestone', AccountMilestoneSchema);
}

export const dbContext = new DbContext()