import express from 'express'
import fs from 'fs'
import path from 'path'
import BaseController from './src/utils/BaseController'
import { logger } from './src/utils/Logger'

let ROUTE_PREFIX = process.env.ROUTE_PREFIX || ''
if (ROUTE_PREFIX && ROUTE_PREFIX[0] != '/') {
  ROUTE_PREFIX = '/' + ROUTE_PREFIX
}

export class Paths {
  static get Public() {
    return path.join(__dirname, 'www')
  }

  static get Server() {
    return path.join(__dirname, 'src')
  }

  static get Controllers() {
    return this.Server + '/controllers'
  }

  static get Handlers() {
    return this.Server + '/handlers'
  }
}

export function RegisterControllers(router) {

  const controllers = fs.readdirSync(Paths.Controllers)
  controllers.forEach(loadController)
  async function loadController(controllerName) {
    try {
      if (!controllerName.endsWith('.js')) return
      const fileHandler = await import(Paths.Controllers + '/' + controllerName)
      let ControllerClass = fileHandler[controllerName.slice(0, -3)]
      if (!ControllerClass) {
        throw new Error(`${controllerName} The exported class does not match the filename`)
      }
      if (ControllerClass.default) {
        ControllerClass = ControllerClass.default
      }
      const controller = new ControllerClass()
      if (controller instanceof BaseController) {
        router.use(ROUTE_PREFIX + controller.mount, controller.router)
      }
    } catch (e) {
      logger.error(
        '[CONTROLLER ERROR] unable to load controller, potential duplication, review mount path and controller class name, and see error below',
        controllerName,
        e
      )
    }
  }
}

export function UseStaticPages(app) {
  app.use(ROUTE_PREFIX, express.static(Paths.Public))
}

const HANDLERS = []

export async function RegisterSocketHandlers() {
  const directory = Paths.Handlers
  const handlers = fs.readdirSync(directory)
  handlers.forEach(async (handlerName) => {
    try {
      if (!handlerName.endsWith('.js')) { return }
      const fileHandler = await import(directory + '/' + handlerName)
      let HandlerClass = fileHandler[handlerName.slice(0, -3)]
      if (!HandlerClass) {
        throw new Error(`${handlerName} The exported class does not match the filename`)
      }
      if (HandlerClass.default) {
        HandlerClass = HandlerClass.default
      }
      HANDLERS.push(HandlerClass)
    } catch (e) {
      logger.error(
        '[SOCKET_HANDLER_ERROR] unable to attach socket handler, potential duplication, review mount path and controller class name, and see error below',
        handlerName,
        e
      )
    }
  })
}

export async function attachHandlers(io, socket, user, profile) {
  if (socket._handlers && user && profile) {
    return socket._handlers.forEach(handler => handler.attachUser(user, profile))
  }
  socket._handlers = HANDLERS.map(Handler => new Handler(io, socket))
}
