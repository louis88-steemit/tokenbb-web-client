export const STACK_NAME = process.env.VUE_APP_STACK_NAME

export const CLIENT_URL = process.env.NODE_ENV === 'production'
  ? 'https://' + STACK_NAME + '.tokenbb.bt-stage.com'
  : 'http://localhost:8080'

export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.bt-stage.com/v1/forum/monsters'
  : 'http://localhost:3030/v1/forum/monsters'

export const CONNECT_API_URL = 'https://steemconnect.com'

export const ACCESS_TOKEN_KEY = 'tokenbb:' + STACK_NAME + ':access-token'

export const USERNAME_KEY = 'tokenbb:' + STACK_NAME + ':username'
