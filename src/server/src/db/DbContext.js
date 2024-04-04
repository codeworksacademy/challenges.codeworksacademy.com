import mongoose from 'mongoose';
import { AccountSchema } from '../models/Account';
import { AccountMilestoneSchema } from "../models/AccountMilestone.js";
import { ChallengeSchema } from '../models/Challenge';
import { ChallengeModeratorSchema } from "../models/ChallengeModerator.js";
import { ChallengeParticipantSchema } from '../models/ChallengeParticipant';
import { MilestoneSchema } from "../models/Milestone.js";

class DbContext {
  Account = mongoose.model('Account', AccountSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  ChallengeParticipants = mongoose.model('Challenge_Participant', ChallengeParticipantSchema);
  ChallengeModerators = mongoose.model('Moderator', ChallengeModeratorSchema);

  Milestones = mongoose.model('Milestone', MilestoneSchema);
  AccountMilestones = mongoose.model('AccountMilestone', AccountMilestoneSchema);
}

export const dbContext = new DbContext()