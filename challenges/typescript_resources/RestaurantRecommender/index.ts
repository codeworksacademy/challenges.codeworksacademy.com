/*NOTE - 
Let’s collaborate on a program that recommends a restaurant from a list of options. The program should use a few variables, like price range, delivery time, distance, and whether the restaurant is open in order to recommend customers the perfect spot.

The problem is that this recommendation program does not recommend much. While the program runs without any fatal JavaScript errors, it does not recommend any satiating suggestions. All we get is a disappointing 'We found 3 restaurants, the first is undefined.'.

Use your knowledge of TypeScript to fix type errors and add the missing features, so we can get customers on their way to good eats.
*/

import restaurants from './restaurants.js';

const dollarSigns = '$$';
const deliveryTimeMax: number = 90;
const maxDistance = 10;
let hour:number = new Date().getHours();
// let hour = 12
let result: string;

const priceBracket: number = dollarSigns.length;

const filteredRestaurants = restaurants.filter((restaurant) => {
   if (Number(restaurant.priceBracket) > priceBracket) {
      return false;
   }

   if (restaurant.deliveryTimeMinutes > deliveryTimeMax) {
      return false;
   }
   //openHour closeHour
   if(hour < Number(restaurant.openHour) || hour > (Number(restaurant.closeHour))){
      return false;
   }

   if (Number(restaurant.distance) > maxDistance) {
      return false;
   }

   return restaurant;
   });

   if (filteredRestaurants.length === 0) {
      result = 'There are no restaurants available right now.';
   } else {
      result = `We found ${filteredRestaurants.length} restaurants, the first is ${filteredRestaurants[0].name}.`;
}

console.log(result);



