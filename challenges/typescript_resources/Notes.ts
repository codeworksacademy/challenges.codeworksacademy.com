//SECTION Types
//TypeScript has the following types
let typeString: string = "Hello World"
let typeNumber: number = 5
let typeBoolean: boolean = true
let typeNull: null;
let typeUndefined: undefined;

//NOTE - If you declare a variable without specifying at type it can be assigned any type of data
let typeVar = "Hello"
typeVar = 5
typeVar = true


//SECTION Functions
//NOTE Function parameters can be typed, set as optional, and defaulted
//You can also declare the datatype of what your function should return
//In this case, it is a string
function parameterInfo(age: number, name?: string, hobby = "Gaming"):string{
   console.log(`Your age is ${age}, your name is ${name || 'Joe Mamma'}, and your favorite thing to do is ${hobby}!`);
}


//FIXME - Debug Exercise
function useMagnifyingGlass():string{
console.log('I will use my magnifying glass.')
}

function determineCulprit(){
return Math.floor(Math.random()*2+1)
}


//NOTE The return type of this function is set to void as it does not return a value
function doSleuthing(numberOfClues:number, clue1:string, clue2:string, suspect1:string, suspect2:number):void{
   console.log('I am a famous detective and I will solve the crime.');
   let unnecessaryVariable = 'Why is this here?'
   unnecessaryVariable=useMagnifyingGlass();

   console.log('Now I consider the first clue: ',clue1);
   console.log('Now I consider the second clue: ',clue1);

   let culpritNumber:string = determineCulprit();
   console.log('Now, I will return to you the culprit. There but for the grace of God go we.' );
   if(culpritNumber == 1) {return(suspect1)}
   if(culpritNumber == 2) {return(suspect2)}

   return "I couldn't figure out who drank the priceless milk. :( :("
}

let answer=3;

answer=doSleuthing('2', 'The parrot heard everything!', 'All the doors and windows were shut from the INSIDE.', 'Burglar Bob', 'Saint Sam')

console.log('The culprit was none other than ', answer, '!');

//LINK - Finished Debug
function useMagnifyingGlass(): string{
   return 'I will use my magnifying glass.';
}

function determineCulprit(): number{
return Math.floor(Math.random()*2+1)
}

function doSleuthing(numberOfClues:number, clue1:string, clue2:string, suspect1:string, suspect2:string):string {
console.log('I am a famous detective and I will solve the crime.');
let unnecessaryVariable = 'Why is this here?'
unnecessaryVariable=useMagnifyingGlass();

console.log('Now I consider the first clue: ',clue1);
console.log('Now I consider the second clue: ',clue1);

let culpritNumber:number = determineCulprit();
console.log('Now, I will return to you the culprit. There but for the grace of God go we.' );
if(culpritNumber == 1) {return(suspect1)}
if(culpritNumber == 2) {return(suspect2)}

return "I couldn't figure out who drank the priceless milk. :( :("
}

let answer: any = 3;

answer = doSleuthing(2, 'The parrot heard everything!', 'All the doors and windows were shut from the INSIDE.', 'Burglar Bob', 'Saint Sam')

console.log('The culprit was none other than ', answer, '!');

//SECTION Arrays

let stringArrayDemo: string[] = ['Yo', 'who', 'ordered', 'boneless', 'pizza', '?']
let multiDimensionalNumbers: number[][] = [[1,2],[3,4],[5,6]]
//NOTE Tuples are an array that has a fixed size that have types in a specific sequence
let normalStringArray: string[] = ['Hello', 'Goodbye']
let tupleStringArray: [number, boolean, string] = [5, true, 'Cats']

//REVIEW - Tuple Examples
function performDanceMove(moveName:string, moveReps:number, hasFlair:boolean):void{
      console.log(`I do the ${moveName} ${moveReps} times !`);
   if(hasFlair){
      console.log('I do it with flair!');
   }
}

//NOTE We declare a tuple of the types for each entry in the array, and add [] at the end to indicate that this is a multi-dimensional array.
let danceMoves: [string, number, boolean][] = [
['chicken beak', 4, false],
['wing flap', 4, false],
['tail feather shake', 4, false],
['clap', 4, false],
['chicken beak', 4, true],
['wing flap', 4, true],
['tail feather shake', 4, true],
['clap', 4, true],
];

/*NOTE 
Iterating over every move in danceMoves
When we call performDanceMove, we are feeding in an array of parameters, following the types in performDanceMove
*/
We use the spread operator to populate the parameters required within performDanceMove
danceMoves.forEach(move => {
   performDanceMove(...move);
})

//LINK - Bonus Tuple from CodeCademy
let monster: [string[],string[],string[][],string[][],string[][][][],string[][][][],number[][][][][][],number[],string[],boolean[],number[],string[],boolean[],number[][]] = [

   [],            []      ,
   [[]],        [[]]      ,
[[[['X']]]],[[[['X']]]]   ,
  [[[[[[1111111]]]]]]     ,
   [],[],[],[],[],[]      ,
         [[3]]

];

//SECTION Enums

let petOnSale = 'chinchilla';
//NOTE Right now the "pets" in this array are strings
let ordersArray = [
   ['rat', 2], 
   ['chinchilla', 1], 
   ['hamster', 2], 
   ['chinchilla', 50]
];

// Write your code below:
//NOTE Types within enums are accessible via the Enum.Type i.e Pet.Hamster
enum Pet{
   Hamster,
   Rat,
   Chinchilla,
   Tarantula
}

//NOTE This variable is now type safe as it has a Enum of Pet types, and is set to a valid type of that enum.
let petOnSaleTS: Pet = Pet.Chinchilla;

//NOTE The [Pet, number] tuple is the type of each array object
//NOTE Adding [] after the tuple indicates that ordersArrayTS is a two dimensional array of the [Pet, number] tuple
let ordersArrayTS: [Pet, number][] = [
   [Pet.Rat, 2],
   [Pet.Chinchilla, 1],
   [Pet.Hamster, 2],
   [Pet.Chinchilla, 50]
]

ordersArrayTS.push([Pet.Jerboa, 3]);

//STUB String Enums and Numeric Enums

let petOnSale = 'chinchilla';
let ordersArray = [
   ['rat', 2], 
   ['chinchilla', 1], 
   ['hamster', 2], 
   ['chinchilla', 50]
];

// Write your code below:

enum Pet{
   Hamster = 'HAMSTER',
   Rat = 'RAT',
   Chinchilla = 'CHINCHILLA',
   Tarantula = 'TARANTULA',
}

let petOnSaleTS: Pet = Pet.Chinchilla;

let ordersArrayTS: [Pet, number][] = [
   [Pet.Rat, 2],
   [Pet.Chinchilla, 1],
   [Pet.Hamster, 2],
   [Pet.Chinchilla, 50]
]

//FIXME Type 'HAMSTER' is not assignable to type 'Pet'

/*NOTE - 
This is because you can't write the value of an Enum's type as a string
In order to set the value to 'HAMSTER', you must use Pet.Hamster
*/
ordersArrayTS.push(['HAMSTER', 1]);

//SECTION - Object Types
//NOTE - We have a personObject as a parameter, we want to specify that is needs an object with types corresponding to the data the function requires to operate.
function sayHappyBirthdayWithObject(personObject: {name: string, age: number, giftWish: string, success: boolean}){
let output ='';
output += 'Happy Birthday '
         + personObject.name + '! ';
output += 'You are now ' 
         + personObject.age + ' years old! ';
output += 'Your birthday wish was to receive ' 
         + personObject.giftWish 
         + '. And guess what? You will ';
if (!personObject.success){
   output += 'not ';
}
output += 'receive it! \n';
console.log(output);
}
//NOTE - Here we added type safety to this array of defined object
let birthdayBabies:{name: string, age: number, giftWish: string, success: boolean}[]  = [
{name: 'Liam', age: 0, giftWish: 'karate skills', success: false}, 
{name: 'Olivia', age: 0, giftWish: 'a bright future', success:true}, 
{name: 'Ava', age: 0, giftWish: '$0.25', success:true}
]; 

birthdayBabies.forEach(sayHappyBirthdayWithObject);

//SECTION Custom Types / Type Aliases

enum cardTypes{
   Clubs = 'Clubs',
   Spades = 'Spades',
   Hearts = 'Hearts',
   Diamonds = 'Diamonds'
}

enum cardValues{
   Ace = 'Ace',
   Queen = 'Queen',
   King = 'King',
   Jack = 'Jack',
   One = 'One',
   Two = 'Two',
   Three = 'Three',
   Four = 'Four',
   Five = 'Five',
   Six = 'Six',
   Seven = 'Seven',
   Eight = 'Eight',
   Nine = 'Nine',
   Ten = 'Ten'
}


//NOTE In order to assign this object types, we must use : instead of =
let mySpecialDeck: {
   name: string,
   creator: {name: string, age:number},
   color: string,
   rare: {editions: number, forSale: boolean},
   price: number,
   deck: [cardTypes, cardValues][]
}

type Coord = [number, number, string, number, number, string]
let codecademyCoordinates: [number, number, string, number, number, string] = [40, 43.2, 'N', 73, 59.8, 'W'];
let bermudaTCoordinates: Coord = [25, 0 , 'N' , 71, 0, 'W'];


//LINK GPT Debugging!


enum BookGenre {
   Fiction = 'Fiction',
   Mystery = 'Mystery',
   ScienceFiction = 'Science Fiction',
   Fantasy = 'Fantasy'
}


enum MediaType {
   Book = 'Book',
   Movie = 'Movie',
   TVShow = 'TV Show',
   Music = 'Music'
}


type MediaItem = {
   title: string;
   genre: BookGenre;
   type: MediaType;
};


function isMediaType(item: MediaItem, mediaType: MediaType): boolean {
   return item.type === mediaType;
}


function recommendMediaByGenre(media: MediaItem[], genre: BookGenre): MediaItem[] {
   return media.filter(item => item.genre === genre);
}


const mediaLibrary: MediaItem[] = [
   { title: 'The Lord of the Rings', genre: BookGenre.Fantasy, type: MediaType.Book },
   { title: 'Blade Runner', genre: BookGenre.ScienceFiction, type: MediaType.Movie },
   { title: 'Sherlock Holmes', genre: BookGenre.Mystery, type: MediaType.Book },
   { title: 'Stranger Things', genre: BookGenre.ScienceFiction, type: MediaType.TVShow }
];

// Main recommendation function that utilizes the previous functions
function makeRecommendations(library: MediaItem[]): void {
   const recommendedMovies = recommendMediaByGenre(library, BookGenre.ScienceFiction);
   console.log('Recommended Science Fiction media:');
   recommendedMovies.forEach(item => console.log(`- ${item.title}`));

   const isMovie = isMediaType(library[1], MediaType.Movie);
   console.log(`Is "${library[1].title}" a movie? ${isMovie}`);
}

// Call the main recommendation function
makeRecommendations(mediaLibrary);