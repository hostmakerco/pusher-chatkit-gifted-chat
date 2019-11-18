# example-npm-publish

An example repository for publishing to npm via CI

## Prerequisites

* Add `NPM_AUTH_TOKEN` to the CircleCI environment config for this project
* Make sure CircleCI uses `hostmakertechteam-bot user key` for `Checkout SSH keys`. This is necessary so that CircleCI can push the new commit to github
