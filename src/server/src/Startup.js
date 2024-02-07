import { Auth0Provider } from '@bcwdev/auth0provider'
import { json } from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { Paths, RegisterControllers, RegisterSocketHandlers, UseStaticPages } from '../Setup'
import { AccountValidator } from './utils/AccountValidator'
import { logger } from './utils/Logger'

export class Startup {
  static ConfigureGlobalMiddleware(app) {
    // NOTE Configure and Register Middleware
    app.use(cors(Startup.corsOptions))
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    }))
    app.use(json({ limit: '50mb' }))
    Startup.UseAuth()
  }

  static UseAuth() {
    // NOTE Configures auth0 middleware that is used throughout controllers
    const AUTH_CONFIG = {
      domain: process.env.AUTH_DOMAIN,
      clientId: process.env.AUTH_CLIENT_ID,
      audience: process.env.AUTH_AUDIENCE
    }
    const { domain, clientId, audience } = AUTH_CONFIG
    if (domain && clientId && audience) {
      return Auth0Provider.configure(AUTH_CONFIG)
    }
    logger.warn('Auth not available, config variables were not set')
  }

  static get corsOptions() {
    const allowedDomains = []
    const corsOptions = {
      origin(origin, callback) {
        if (process.env.NODE_ENV === 'dev') {
          return callback(null, true)
        }
        const originIsWhitelisted = allowedDomains.indexOf(origin) !== -1
        callback(null, originIsWhitelisted)
      },
      credentials: true
    }
    return corsOptions
  }

  static ConfigureRoutes(app) {
    const router = express.Router()
    app.use(AccountValidator)
    RegisterControllers(router)
    RegisterSocketHandlers()
    app.use(router)
    UseStaticPages(app)
    Startup.registerErrorHandlers(app)
  }

  static registerErrorHandlers(app) {
    // NOTE SEND JSON 404 for any unknown routes
    app.use('/api', (_, res, next) => {
      res.status(404).send({ status: 404, message: 'Not Found' })
    })

    // NOTE SEND HTML 404 for any unknown routes
    app.use(
      '*',
      (_, res, next) => {
        res.status(404)
        next()
      },
      express.static(Paths.Public + '404')
    )
    // NOTE Default Error Handler
    app.use((error, req, res, next) => {
      if (!error.status) {
        error.status = 400
      }
      if (error.status === 500) {
        logger.error(error)
      }
      res.status(error.status).send({ error: { message: error.toString(), status: error.status }, url: req.url })
    })
  }
}
