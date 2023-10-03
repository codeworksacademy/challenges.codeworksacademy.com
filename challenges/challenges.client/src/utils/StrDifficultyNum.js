import { logger } from "./Logger.js"

export const StrDifficultyNum = ( difficulty ) => {
  switch ( difficulty ) {
    case 1:
      logger.log('Difficulty: Easy')
      return 'easy'
    case 2:
      logger.log('Difficulty: Medium')
      return 'medium'
    case 3:
      logger.log('Difficulty: Hard')
      return 'hard'
    default:
      logger.log('Difficulty: Not Specified')
      return 'not specified'
  }
}
