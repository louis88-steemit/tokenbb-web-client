#/bin/bash

STACK_NAME=$1

NODE_ENV=production npm run build && 
aws s3 sync dist/ s3://$STACK_NAME.tokenbb.io/
