.PHONY: install lint test build dev preview clean all prod local

install:
	npm install

lint:
	npm run lint

test:
	npm run test -- --run

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

# CI pipeline style full
all: lint test

# Production pipeline
prod: install lint test build

# Local dev pipelne
local: install dev

clean:
	rm -rf node_modules
	rm -rf dist
