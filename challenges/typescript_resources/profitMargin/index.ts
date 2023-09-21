/*NOTE - 
   This is for a profit margin calculator for Grand Theft Auto FiveM players. All things mentioned here are in game and in no way reflect real life.
*/

enum category{
   zaza = 'Zaza',
   frosting = 'Frosting',
}

type Recipe = {
   name: string,
   category: category,
   instructions: [number, string][],
   productionCost: number,
   bagPrice: number,
   bulkPrice: number,
   bagProfitMargin: number,
   bulkProfitMargin: number,
}

let recipes: Recipe[] = [];


//NOTE Khalifa 1-2 1-2 2-1

