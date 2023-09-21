type UserProfile = {
   id: number;
   username: string;
   email: string;
   age: number;
   isPremium: boolean;
}

function userInfo(user?: UserProfile): void { //the parameter user has been defined to be of the userProfile type.
   console.log(`User ${user.id}'s Profile`);
   console.log(`${user.username}`);
   console.log(`${user.email}`);
   console.log(`${user.age}`)
   if(user.isPremium){
      console.log(`${user.username} is Premium`)
   } else {
      console.log(`${user.username} is not Premium`)
   }
}

function userInfo(user: UserProfile): string {
   return user.email
}

const user: UserProfile = {
   id: 1,
   username: 'John Doe',
   email: 'john@doe.com',
   age: 21,
   isPremium: true,
}

const Chantha: UserProfile = {
   id: 2,
   username: 'Chantha',
   email: 'chantha@kammer.dev',
   age: 23,
   isPremium: false
}
   

userInfo(Chantha)
const array: string[] = []

array.push("Hi")
array.push(9)  
