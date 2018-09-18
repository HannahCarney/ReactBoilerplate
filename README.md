
# React Boilerplate project

A base project for starting new web apps. Contains a sane webpack setup, environmental config, redux, axios http client, routing, basic login screen, rollbar error reporting, eslint and CI/Deployment setup for bitbucket/S3.

## Instructions for use

* Create your new, empty project and create an empty initial commit:
    * `git init`
    * `git commit --allow-empty -m "initial commit"`
* Add this repository as a git remote and merge in changes:
    * `git remote add upstream git@bitbucket.org:playconsulting/react-boilerplate.git`
    * `git fetch upstream`
    * `git merge --allow-unrelated-histories --squash upstream/master`
    * `git commit -m "bootstrap from https://bitbucket.org/playconsulting/react-boilerplate"`
* Remove the remote:
    * `git remote remove upstream`
* Set the name of your project in `package.json`, using the `name` key
* Set the S3 bucket names of your environments in `scripts/deploy.sh`
* Delete these instructions in the README.md, leaving everything below the line

--------

# My App (React Boilerplate)

## Project setup

* `npm install -g yarn` - this installs `yarn` globally. You can skip if `yarn` is already installed.
* `yarn` - this will install all our dependencies.

Any new dependencies MUST be installed by running `yarn add <module name>`

## Running locally
 
run `npm run dev`

## Preparing for production deploy

Increment the version in `package.json` and push the tag to bitbucket:

* `npm version patch`
* `git push`
* `git push --tags`

## Building for production

Run the `deploy-to-production` bitbucket pipeline on the tag you created, if you have access.

