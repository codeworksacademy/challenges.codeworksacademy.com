"use strict";
/*NOTE -
Let’s collaborate on a program that recommends a restaurant from a list of options. The program should use a few variables, like price range, delivery time, distance, and whether the restaurant is open in order to recommend customers the perfect spot.

The problem is that this recommendation program does not recommend much. While the program runs without any fatal JavaScript errors, it does not recommend any satiating suggestions. All we get is a disappointing 'We found 3 restaurants, the first is undefined.'.

Use your knowledge of TypeScript to fix type errors and add the missing features, so we can get customers on their way to good eats.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var restaurants_js_1 = require("./restaurants.js");
var dollarSigns = '$$';
var deliveryTimeMax = 90;
var maxDistance = 10;
var hour = new Date().getHours();
var result;
var priceBracket = dollarSigns.length;
var filteredRestaurants = restaurants_js_1.default.filter(function (restaurant) {
    if (Number(restaurant.priceBracket) > priceBracket) {
        return false;
    }
    if (restaurant.deliveryTimeMinutes > deliveryTimeMax) {
        return false;
    }
    //openHour closeHour
    if (Number(restaurant.openHour) < hour || Number(restaurant.closeHour) < hour) {
        return false;
    }
    if (Number(restaurant.distance) > maxDistance) {
        return false;
    }
    return restaurant;
});
if (filteredRestaurants.length === 0) {
    result = 'There are no restaurants available right now.';
}
else {
    result = "We found ".concat(filteredRestaurants.length, " restaurants, the first is ").concat(filteredRestaurants[0].name, ".");
}
console.log(result);
