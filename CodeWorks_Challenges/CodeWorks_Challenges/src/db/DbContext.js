import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ValueSchema } from '../models/Value'
import { ChallengeSchema } from '../models/Challenge';
import { ParticipantSchema } from '../models/Participant';
import { RewardSchema } from '../models/Reward';
import { ModeratorSchema } from "../models/Moderator.js";
import { AnswerSchema } from '../models/Answer.js';

class DbContext {
  Values = mongoose.model('Value', ValueSchema);
  Account = mongoose.model('Account', AccountSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  Participants = mongoose.model('Participant', ParticipantSchema);
  Rewards = mongoose.model('Reward', RewardSchema);
  Moderators = mongoose.model('Moderator', ModeratorSchema);
  Answers = mongoose.model('Answer', AnswerSchema);
}

export const dbContext = new DbContext()
