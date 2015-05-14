#!/bin/bash

: ${TIMEOUT:=50000}
: ${REPORTER:="spec"}
: ${BAIL:=1}

if [ $BAIL -eq 1 ]; then
    BAIL_OPT="--bail"
else
    BAIL_OPT=""
fi

./node_modules/.bin/mocha \
    $BAIL_OPT \
    --timeout $TIMEOUT \
    --require=./tests/node.setup.js \
    --reporter=$REPORTER \
    --grep=$GREP \
    tests/test.*.js
