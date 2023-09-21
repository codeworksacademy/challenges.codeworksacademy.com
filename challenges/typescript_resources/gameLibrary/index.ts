class Game{
   name:string
   rating: string
   category: string
   cost:number
   crossPlay:boolean
   upVotes: number
   constructor(name: string, rating: string, category: string, cost: number, crossPlay: boolean, upVotes: number){
      this.name = name;
      this.rating = rating;
      this.category = category;
      this.cost = cost;
      this.crossPlay = crossPlay;
      this.upVotes = upVotes;
   }
}

