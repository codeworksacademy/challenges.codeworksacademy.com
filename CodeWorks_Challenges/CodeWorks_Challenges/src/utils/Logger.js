export class Logger {
  constructor(tag = '') {
    this.tag = tag
  }

  get prefix() {
    return `${new Date().toLocaleTimeString('en-US')}${this.tag ? '::[' + this.tag + ']' : ''}`
  }

  _print(method, args) {
    if (process.env.NODE_ENV === 'dev') {
      // eslint-disable-next-line no-console
      console[method](this.prefix, ...args)
    } else {
      switch (method) {
        case 'log':
        case 'debug':
          return
      }
      // eslint-disable-next-line no-console
      console[method](this.prefix, ...args)
    }
  }

  log() {
    this._print('log', arguments)
  }

  trace() {
    this._print('trace', arguments)
  }

  debug() {
    this._print('debug', arguments)
  }

  info() {
    this._print('info', arguments)
  }

  warn() {
    this._print('warn', arguments)
  }

  error() {
    this._print('error', arguments)
  }
}

export const logger = new Logger()
