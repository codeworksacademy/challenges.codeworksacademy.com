function updatePlayer(account, updateData) {
}
var Chantha = {
    username: 'Chantha',
    money: 20,
    wins: 0,
    losses: 1,
};
var Action;
(function (Action) {
    Action["rock"] = "ROCK";
    Action["paper"] = "PAPER";
    Action["scissors"] = "SCISSORS";
})(Action || (Action = {}));
function generateAction() {
    var index = Math.floor(Math.random() * 3);
    return Action[index];
}
function rockPaperScissors(account, myAction) {
    if (account.money == 0) {
        return "You do not have enough money to participate! Minimum is $10. You have $".concat(account.money, ".");
    }
    var randomAction = generateAction();
    switch (myAction) {
        case Action.rock:
            switch (randomAction) {
                case Action.rock:
                    return "It is a tie! Both of you chose rock.";
                case Action.paper:
                    //NOTE Add player update here
                    return "You lost! Their paper beat your rock.";
                case Action.scissors:
                    return "You won! Your rock beat their paper.";
                default:
                    return "Error, check your choices.";
            }
        case Action.paper:
            switch (randomAction) {
                case Action.rock:
                    return "You won! Your paper beat their rock.";
                case Action.paper:
                    return "It is a tie! Both of you chose paper.";
                case Action.scissors:
                    return "You lost! Their scissors beat your paper.";
                default:
                    return "Error, check your choices";
            }
        case Action.scissors:
            switch (randomAction) {
                case Action.rock:
                    return "You lost! Their rock beat your scissors.";
                case Action.paper:
                    return "You won! Your scissors beat their paper.";
                case Action.scissors:
                    return "It is a tie! Both of you chose scissors.";
                default:
                    return "Error, check your choices";
            }
        default:
            return "Error, check your choices.";
    }
}
Math.floor(Math.random() * 3);
generateAction();
