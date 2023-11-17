import { AppState } from '../AppState'
import { Challenge } from "../models/Challenge.js"

export const GRADE_FIELDS = [
  {
    requirement: {
      step: 'Did the participant complete the challenge?',
      completed: false,
      comment: ''
    },
  },
  {
    requirement: {
      step: 'Is it something your mother would be proud of?',
      completed: false,
      comment: ''
    },
  },
  {
    requirement: {
      step: 'Does the participant deserve a shiny gold star?',
      completed: false,
      comment: ''
    },
  },
  {
    requirement: {
      step: 'Do you think the participant is a good person?',
      completed: false,
      comment: ''
    },
  },
  {
    requirement: {
      step: 'Like...would you invite them to your birthday party?',
      completed: false,
      comment: ''
    },
  },
  {
    requirement: {
      step: 'When you think of the participant, do you smile?',
      completed: false,
      comment: ''
    },
  },
  {
    requirement: {
      step: 'Would you ever consider going on a date with the participant?(Check for yes, leave blank for no)',
      completed: false,
      comment: ''
    },
  },
  {
    requirement: {
      step: 'Scenario: You are stranded in the middle of the ocean. You found a piece of driftwood that looks like an old door that can only hold your weight. Do you let Jack on the door with you? (Check for yes, leave blank for no)',
      completed: false,
      comment: ''
    },
  },
  {
    requirement: {
      step: 'Flashback: The year is 39,000,000 BC. You are a dinosaur...a T-Rex to be specific. You are hungry. You see a Triceratops to your left and a plate of nachos to your right. Which do you choose? (Check for Triceratops, leave blank for nachos)',
      completed: false,
      comment: ''
    },
    feedback: {
      type: String,
      maxlength: 250,
      required: true
    },
    grade: {
      rank: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
      },
      xp: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
      },
    }
  },
]