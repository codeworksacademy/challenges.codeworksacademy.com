import { AppState } from "../AppState"
import { Profile } from "../models/Profile"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"

class ProfilesService{
  async getProfile(profileId){
    const res = await api.get(`api/profiles/${profileId}`)

    logger.log('[GOT PROFILE BY ID]', res.data)

    AppState.activeProfile = new Profile(res.data)
  }

  clearProfile(){
    AppState.activeProfile = null
  }

}

export const profilesService = new ProfilesService()