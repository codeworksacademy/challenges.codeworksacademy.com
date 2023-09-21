"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var products_js_1 = require("./products.js");
var productName = 'beanie';
var shipping;
var taxPercent;
var taxTotal;
var total;
var shippingAddress;
//NOTE - Find returns a single object
//NOTE - Filter returns an array of objects
function preOrder(productName, address) {
    var product = products_js_1.default.find(function (p) { return p.name == productName; });
    if (Number(product.price) > 25) {
        shipping = 0;
    }
    else {
        shipping = 5;
    }
    if (address === 'New York') {
        taxPercent = 0.10;
    }
    if (product.preOrder === true) {
        return "Your order of ".concat(product.name, " is on on the way. The shipping is ").concat(shipping, ". Your tax is ").concat(taxPercent);
    }
    else {
        return "The pre-order for ".concat(product.name, " is closed. The shipping is $").concat(shipping, ". Your tax is ").concat(taxPercent);
    }
}
preOrder('fanny pack', 'New York');
preOrder('beanie');
preOrder('tote bag');
preOrder('shirt');
preOrder('hoodie');
