function useMagnifyingGlass() {
    return 'I will use my magnifying glass.';
}
function determineCulprit() {
    return Math.floor(Math.random() * 2 + 1);
}
function doSleuthing(numberOfClues, clue1, clue2, suspect1, suspect2) {
    console.log('I am a famous detective and I will solve the crime.');
    var unnecessaryVariable = 'Why is this here?';
    unnecessaryVariable = useMagnifyingGlass();
    console.log('Now I consider the first clue: ', clue1);
    console.log('Now I consider the second clue: ', clue2); // Fixed typo: changed 'clue1' to 'clue2'
    var culpritNumber = determineCulprit();
    console.log('Now, I will return to you the culprit. There but for the grace of God go we.');
    if (culpritNumber === 1) {
        return suspect1; // Fixed: changed 'return(suspect1)' to 'return suspect1'
    }
    if (culpritNumber === 2) {
        return suspect2; // Fixed: changed 'return(suspect2)' to 'return suspect2'
    }
    return "I couldn't figure out who drank the priceless milk. :( :(";
}
var answer = 3;
answer = doSleuthing(2, 'The parrot heard everything!', 'All the doors and windows were shut from the INSIDE.', 'Burglar Bob', 'Saint Sam');
console.log('The culprit was none other than ', answer, '!');
