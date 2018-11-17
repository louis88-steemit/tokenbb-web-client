if (!process.env.VUE_APP_STACK_NAME) {
  // throw new Error('Missing variable VUE_APP_STACK_NAME in .env file.')
  process.env.VUE_APP_STACK_NAME = 'monsters'
}

if (!process.env.APP_AUTH_HOST) {
  // throw new Error('Missing variable VUE_APP_STACK_NAME in .env file.')
  process.env.APP_AUTH_HOST = 'https://auth.bt-stage.com'
}

module.exports = {}
