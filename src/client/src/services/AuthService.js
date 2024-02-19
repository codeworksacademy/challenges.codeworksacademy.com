import { initialize } from '@bcwdev/auth0provider-client'
import { audience, clientId, domain } from '../env'
import { AppState } from '../AppState'
import { router } from '../router'
import { api } from './AxiosService'
import { socketService } from './SocketService'
import { accountService } from './AccountService'

export const AuthService = initialize({
  domain,
  clientId,
  audience,
  useRefreshTokens: true,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})

AuthService.on(AuthService.AUTH_EVENTS.AUTHENTICATED, async function () {
  api.defaults.headers.authorization = AuthService.bearer
  api.interceptors.request.use(refreshAuthToken)
  AppState.user = AuthService.user
  await accountService.getAccount()
  socketService.authenticate(AuthService.bearer)
  // NOTE if there is something you want to do once the user is authenticated, place that here
  accountService.getAccountData()
})

async function refreshAuthToken(config) {
  if (!AuthService.isAuthenticated) { return config }
  const expires = AuthService.identity.exp * 1000
  const expired = expires < Date.now()
  const needsRefresh = expires < Date.now() + (1000 * 60 * 60 * 12)
  if (expired) {
    await AuthService.loginWithPopup()
  } else if (needsRefresh) {
    await AuthService.getTokenSilently()
    api.defaults.headers.authorization = AuthService.bearer
    socketService.authenticate(AuthService.bearer)
  }
  return config
}
