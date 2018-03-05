## PayIt
[![Build Status](https://www.bitrise.io/app/d54f030b865cd56f/status.svg?token=1n6D1N_MkV52lxaz3k6ySQ&branch=master)](https://www.bitrise.io/app/d54f030b865cd56f)
[![Greenkeeper badge](https://badges.greenkeeper.io/tsirlucas/PayIt.svg)](https://greenkeeper.io/)

## Running locally

First, clone the repo and start the local server

1. Clone the repository: `git clone https://github.com/tsirlucas/PayIt.git`
2. `cd PayIt`
3. `yarn`
4. `yarn start`

Then, call `yarn ios` or `yarn android`

## Running unit tests
- `yarn test`

## Running e2e tests in android
1. `yarn appium`
2. `yarn start`
3. `create and run a x86 android emulator and name it AndroidEmulator`
4. `yarn android`
5. `yarn e2e:android`

## Running e2e tests in ios
1. `yarn appium`
2. `yarn start`
3. `run the ios simulator with an iphone 7 device`
4. `yarn ios`
5. `yarn e2e:ios`
