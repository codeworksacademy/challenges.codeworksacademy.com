import * as data from './data.json'

export const SUBMISSION_TYPES = data.SUBMISSION_TYPES
export const CATEGORY_TYPES = data.CATEGORY_TYPES
export const STATUS_TYPES = data.STATUS_TYPES
export const MILESTONE_TIER = data.MILESTONE_TIER

export const RANK_VALUES = Object.values(data.RANK_VALUES).map(badge => {
  return {
    ...badge,
    //color: data.COLOR_FILLS[badge.color]
  }
})

export const PROFILE_RANKS = data.RANK_VALUES
export const TITLE_BGS = data.TITLE_BGS
export const COLOR_FILLS = data.COLOR_FILLS
export const PROFILE_FIELDS = data.PROFILE_FIELDS