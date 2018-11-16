if (!process.env.VUE_APP_STACK_NAME) {
  // throw new Error('Missing variable VUE_APP_STACK_NAME in .env file.')
  process.env.VUE_APP_STACK_NAME = 'monsters'
}

module.exports = {}
