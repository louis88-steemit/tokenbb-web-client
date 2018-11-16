# TokenBB Vue.js app

## Install

.env file:

```sh
VUE_APP_STACK_NAME=my-app
```

## Develop

`npm run serve` -> http://localhost:8080

## Build


## Deploy

```sh
NODE_ENV=production npm run build && 
aws s3 sync dist/ s3://$STACK_NAME.tokenbb.io/`
```
