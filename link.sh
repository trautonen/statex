#!/usr/bin/env bash

cd diff && npm link && cd ..
cd proxy && npm link && cd ..
cd state && npm link && cd ..
cd store && npm link @statex/state && npm link && cd ..
cd simple && npm link @statex/diff && npm link @statex/proxy && npm link @statex/state && npm link @statex/store && cd ..
