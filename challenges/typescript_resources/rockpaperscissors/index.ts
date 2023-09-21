type Account = {
   username: string,
   money: number,
   wins: number,
   losses: number
}

function updatePlayer(account: Account, won):void{
   if(won){
      account.wins++
   } else {
      account.losses++
   }
}

let Chantha:Account = {
   username: 'Chantha',
   money: 20,
   wins: 0,
   losses: 1,
}

enum Action{
   rock = 'ROCK',
   paper = 'PAPER',
   scissors = 'SCISSORS'
} 
function generateAction(): Action{
   const actions: Action[] = [Action.rock, Action.paper, Action.scissors]
   const index:number =  Math.floor(Math.random() * 3)
   return actions[index]
}

function rockPaperScissors(account: Account, myAction: Action):string{
   if(account.money == 0){
      return `You do not have enough money to participate! Minimum is $10. You have $${account.money}.`
   }
   const randomAction = generateAction()
   switch(myAction){
      case Action.rock:
         switch(randomAction) {
            case Action.rock: 
               return `It is a tie! Both of you chose rock.`
            case Action.paper:
               updatePlayer(account, false)
               return `You lost! Their paper beat your rock.`
            case Action.scissors:
               updatePlayer(account, true)
               return `You won! Your rock beat their paper.`
            default:
               return `Error, check your choices.`
         }
      case Action.paper:
         switch(randomAction){
            case Action.rock: 
            updatePlayer(account, true)
               return `You won! Your paper beat their rock.`
            case Action.paper:
               return `It is a tie! Both of you chose paper.`
            case Action.scissors:
               updatePlayer(account, false)
               return `You lost! Their scissors beat your paper.`
            default:
               return `Error, check your choices`
         }
      case Action.scissors:
         switch(randomAction){
            case Action.rock:
               updatePlayer(account, false)
               return `You lost! Their rock beat your scissors.`
            case Action.paper:
               updatePlayer(account, true)
               return `You won! Your scissors beat their paper.`
            case Action.scissors:
               return `It is a tie! Both of you chose scissors.`
            default:
               return `Error, check your choices`
         }  
      default:
         return `Error, check your choices.`
   }
}

rockPaperScissors(Chantha, Action.scissors)
