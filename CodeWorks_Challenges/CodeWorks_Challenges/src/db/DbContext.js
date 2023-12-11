import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ChallengeSchema } from '../models/Challenge';
import { ChallengeParticipantSchema } from '../models/ChallengeParticipant';
import { ChallengeModeratorSchema } from "../models/ChallengeModerator.js";
// import { AnswerSchema } from '../models/Answer.js';
import { SubmissionSchema } from '../models/Submission.js';
import { MilestoneSchema } from "../models/Milestone.js";
import { AccountMilestoneSchema } from "../models/AccountMilestone.js";
import { CacheSchema } from "../models/Cache.js";

class DbContext {
  Account = mongoose.model('Account', AccountSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  ChallengeParticipants = mongoose.model('Challenge_Participant', ChallengeParticipantSchema);
  ChallengeModerators = mongoose.model('Moderator', ChallengeModeratorSchema);
  // Answers = mongoose.model('Answer', AnswerSchema);
  Submissions = mongoose.model('Submission', SubmissionSchema);
  Milestones = mongoose.model('Milestone', MilestoneSchema);
  AccountMilestones = mongoose.model('AccountMilestone', AccountMilestoneSchema);
  Cache = mongoose.model('Cache', CacheSchema)
}

export const dbContext = new DbContext()