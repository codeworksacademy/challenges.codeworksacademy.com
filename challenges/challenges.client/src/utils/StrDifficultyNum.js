export const StrDifficultyNum = ( difficulty ) => {
  switch ( difficulty ) {
    case 1:
      return 'easy'
    case 2:
      return 'medium'
    case 3:
      return 'hard'
    default:
      return 'not specified'
  }
}
