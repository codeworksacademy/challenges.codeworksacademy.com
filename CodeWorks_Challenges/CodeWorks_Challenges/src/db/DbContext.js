import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ChallengeSchema } from '../models/Challenge';
import { ChallengeParticipantSchema } from '../models/Participant';
import { ModeratorSchema } from "../models/Moderator.js";
<<<<<<< HEAD
import { MilestoneSchema } from "../models/Milestone.js";
import { AccountMilestoneSchema } from "../models/AccountMilestone.js";
=======
import { AnswerSchema } from '../models/Answer.js';
import { SubmissionSchema } from '../models/Submission.js';
>>>>>>> 9337487010152b54d5695a0e414ade387c90b454

class DbContext {
  Account = mongoose.model('Account', AccountSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  Participants = mongoose.model('Participant', ChallengeParticipantSchema);
  Moderators = mongoose.model('Moderator', ModeratorSchema);
  Answers = mongoose.model('Answer', AnswerSchema);
  Submissions = mongoose.model('Submission', SubmissionSchema);
}

export const dbContext = new DbContext()