.PHONY: github dev_env lint test build dev preview clean all prod local

dev:
	npm run dev

github:
	- git commit -a
	git push origin master

lint:
	npm run lint

test:
	npm run test -- --run

# CI pipeline style full
all_tests: lint test

dev_env:
	npm install

build:
	npm run build

preview:
	npm run preview

# Production pipeline
prod: all_tests github

clean:
	rm -rf node_modules
	rm -rf dist
