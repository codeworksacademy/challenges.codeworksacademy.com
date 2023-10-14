import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ValueSchema } from '../models/Value'
import { ChallengeSchema } from '../models/Challenge';
import { ParticipantSchema } from '../models/Participant';
import { RewardSchema } from '../models/Reward';
import { ModeratorSchema } from "../models/Moderator.js";

class DbContext {
  Values = mongoose.model('Value', ValueSchema);
  Account = mongoose.model('Account', AccountSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  Participants = mongoose.model('Participant', ParticipantSchema);
  Rewards = mongoose.model('Reward', RewardSchema);
  Moderators = mongoose.model('Moderator', ModeratorSchema);
}

export const dbContext = new DbContext()
