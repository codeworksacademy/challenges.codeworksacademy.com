import products from "./products.js"

let productName:string = 'beanie'

let shipping: number;
let taxPercent: number;
let taxTotal: number;
let total: number;
let shippingAddress: string;

//NOTE - Find returns a single object
//NOTE - Filter returns an array of objects
function preOrder(productName: string, address?: string):string {
   const product = products.find(p => p.name == productName)
   if(Number(product?.price) > 25){
      shipping = 0;
   } else {
      shipping = 5
   }
   taxPercent = 0;
   if(address === 'New York'){
      taxPercent = 0.10
   } 
   if(!address){
      return `Error, add a shipping address.`
   }
   total = Number(product?.price) * taxPercent + shipping;
   if(product?.preOrder == 'true') {
      return `Your order of ${product.name} is on on the way. The shipping is ${shipping}. Your tax is ${taxPercent}. Total = $${total}`
   } else {
      return `The pre-order for ${product?.name} is closed. The shipping is $${shipping}. Your tax is ${taxPercent}. Total = $${total}`
   }
}

preOrder('fanny pack', 'New York')
preOrder('beanie')
preOrder('tote bag')
preOrder('shirt')
preOrder('hoodie')
