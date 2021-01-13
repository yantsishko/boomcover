#!/bin/bash

if [[ $1 ]]; then
    env $(cat .env.local | xargs) ./node_modules/.bin/ts-node -r tsconfig-paths/register cli.ts $*
else
    echo 'Please enter command'
    exit 1
fi