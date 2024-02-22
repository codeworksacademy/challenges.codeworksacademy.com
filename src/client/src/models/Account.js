import { Profile } from "./Profile.js"

export class Account extends Profile {
  constructor(data) {
    super(data)

    this.email = data.email

  }
}
