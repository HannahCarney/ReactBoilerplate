SHELL := /bin/bash
PATH := $(shell echo $$PATH)

all: install lint test build-development

install_yarn:
	apt-get update && apt-get install -y apt-transport-https
	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
	echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
	apt-get update && apt-get install -y yarn

install_awscli:
	apt-get update && apt-get install -y python-dev
	curl -O https://bootstrap.pypa.io/get-pip.py
	python get-pip.py
	pip install awscli

install:
	yarn install

lint: install
	yarn run lint

test: install
	yarn test

build: lint test
	COMMIT_SHA=$$BITBUCKET_COMMIT yarn run build:production

build-development: lint test
	COMMIT_SHA=$$BITBUCKET_COMMIT yarn run build:development

deploy-development: build-development
	scripts/deploy.sh development

deploy: build
	scripts/deploy.sh production