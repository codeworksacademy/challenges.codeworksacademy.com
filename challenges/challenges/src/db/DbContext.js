import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { ValueSchema } from '../models/Value'
import { EventSchema } from '../models/Event'
import { ChallengeSchema } from '../models/Challenge'
import { ParticipantSchema } from '../models/Participant'

class DbContext {
  Values = mongoose.model('Value', ValueSchema);
  Account = mongoose.model('Account', AccountSchema);
  Events = mongoose.model('Event', EventSchema);
  Challenges = mongoose.model('Challenge', ChallengeSchema);
  Participants = mongoose.model('Participant', ParticipantSchema);
}

export const dbContext = new DbContext()
