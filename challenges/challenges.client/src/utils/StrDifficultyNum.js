
export const StrDifficultyNum = ( difficulty ) => {
  switch ( difficulty ) {
    case 1:
      return 'Easy'
    case 2:
      return 'Medium'
    case 3:
      return 'Hard'
    default:
      return 'Not Specified'
  }
}
