import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ChallengeSchema } from '../models/Challenge';
import { ChallengeParticipantSchema } from '../models/ChallengeParticipant';
import { ModeratorSchema } from "../models/Moderator.js";
// import { AnswerSchema } from '../models/Answer.js';
import { SubmissionSchema } from '../models/Submission.js';
import { AccountMilestoneSchema } from "../models/AccountMilestone.js";
import { MilestoneSchema } from "../models/Milestone.js";

class DbContext {
  Account = mongoose.model('Account', AccountSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  Participants = mongoose.model('Participant', ChallengeParticipantSchema);
  Moderators = mongoose.model('Moderator', ModeratorSchema);
  // Answers = mongoose.model('Answer', AnswerSchema);
  Submissions = mongoose.model('Submission', SubmissionSchema);

  // STUB Kyle - Milestones and AccountMilestones were removed and had to be re-imported. If these were removed intentionally please let me know why.
  Milestones = mongoose.model('Milestone', MilestoneSchema);
  AccountMilestones = mongoose.model('AccountMilestone', AccountMilestoneSchema);
}

export const dbContext = new DbContext()