export class SocketHandler {
  /**
   * @param {import('socket.io').Server} io
   * @param {import('socket.io').Socket} socket
   * @param {boolean | function():boolean} requiresAuth
   */
  constructor(io, socket, requiresAuth = false) {
    this.io = io
    this.socket = socket
    this.user = null
    this.profile = null
    if (requiresAuth === true) {
      requiresAuth = () => this.user
    }
    this.requiresAuth = requiresAuth
  }

  /**
   * 
   * @param {string} event 
   * @param {()=> void} fn 
   * @returns 
   */
  on(event, fn) {
    this.socket.on(event, (payload) => {
      try {
        if (!this.requiresAuth) {
          return fn.call(this, payload)
        }
        if (!this.requiresAuth()) {
          return this.socket.emit('error', { message: 'Unauthorized' })
        }
        return fn.call(this, payload)
      } catch (e) {
        this.socket.emit('error', { message: e.message })
      }
    })
    return this
  }

  /**
   * Message only the socket that initiated the request
   * @param {string} event 
   * @param {any} payload 
   */
  messageSelf(event, payload) {
    this.socket.emit(event, payload)
  }

  /**
   * Messages all sockets currently connected
   * @param {string} event 
   * @param {any} payload 
   */
  messageAll(event, payload) {
    this.io.emit(event, payload)
  }

  /**
   * Message all members of a room
   * @param {string} room 
   * @param {string} event 
   * @param {any} payload 
   */
  messageRoom(room, event, payload) {
    this.io.to(room).emit(event, payload)
  }


  attachUser(user, profile) {
    this.user = user
    this.profile = profile
  }
}
