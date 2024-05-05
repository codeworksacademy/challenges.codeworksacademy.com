export const dev = window.location.origin.includes('localhost')
export const baseURL = dev ? 'http://localhost:3000' : ''
export const useSockets = false
export const domain = dev ? 'dev-82py0l5jt61zn10o.us.auth0.com' : 'codeworksacademy.auth0.com'
export const clientId = dev ? 'hykoUyNDCrsovYQXXUKObg3y1Iw4UhUS' : 'Pr738Hn5ZZhYYahOhTukx3phzlIPGCfl'
export const audience = dev ? 'http://sandbox.com' : 'https://codeworksacademy.com'
