import * as data from './data.json'

export const SUBMISSION_TYPES = data.SUBMISSION_TYPES;
export const CATEGORY_TYPES = data.CATEGORY_TYPES;
export const STATUS_TYPES = data.STATUS_TYPES;
export const MILESTONES = Object.values(data.MILESTONES.map(m => {
  return {
    description: m.DESCRIPTION,
    tier: m.TIER,
    icon: m.CURRENT_MARKER || m.NEXT_MARKER,
    difficulty: m.DIFFICULTY,
    requirement: m.REQUIREMENT,
    primaryColors: m.PRIMARY,
    secondaryColors: m.SECONDARY
  }
}));

export const RANK_TITLE = Object.values(data.RANK_TITLE).map(badge => {
  return {
    ...badge,
    COLOR: data.COLOR_FILLS[badge.COLOR]
  }
});

export const PROFILE_TITLES = data.RANK_TITLE
export const TITLE_BGS = data.TITLE_BGS
export const COLOR_FILLS = data.COLOR_FILLS
export const PROFILE_FIELDS = data.PROFILE_FIELDS